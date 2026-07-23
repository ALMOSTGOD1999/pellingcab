import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ── Password hashing (PBKDF2 via Web Crypto) ───────────────────────────────
const encoder = new TextEncoder();

async function pbkdf2(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 100_000, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(derived);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  // Format: base64(salt):base64(hash)
  return `${btoa(String.fromCharCode(...salt))}:${btoa(String.fromCharCode(...hash))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
  const expectedHash = Uint8Array.from(atob(hashB64), (c) => c.charCodeAt(0));
  const actualHash = await pbkdf2(password, salt);
  if (actualHash.length !== expectedHash.length) return false;
  return actualHash.every((b, i) => b === expectedHash[i]);
}

// ── Session JWT ────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "pellingcab-dev-secret-change-in-production";
const COOKIE_NAME = "pellingcab_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function signToken(payload: { userId: number; isAdmin: boolean }): Promise<string> {
  const encoder = new TextEncoder();
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + SESSION_MAX_AGE,
  };

  const base64Url = (input: string) =>
    btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const headerB64 = base64Url(JSON.stringify(header));
  const payloadB64 = base64Url(JSON.stringify(tokenPayload));
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const sigB64 = base64Url(String.fromCharCode(...new Uint8Array(signature)));

  return `${data}.${sigB64}`;
}

async function verifyToken(token: string): Promise<{ userId: number; isAdmin: boolean } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const encoder = new TextEncoder();
    const data = `${parts[0]}.${parts[1]}`;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigBytes = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0),
    );
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
    if (!valid) return null;

    const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { userId: payload.userId, isAdmin: payload.isAdmin };
  } catch {
    return null;
  }
}

// ── Auth helpers ───────────────────────────────────────────────────────────
export interface SessionUser {
  userId: number;
  isAdmin: boolean;
  name: string;
  email: string | null;
  phone: string;
}

export async function getUserFromRequest(request: Request): Promise<SessionUser | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const session = await verifyToken(token);
  if (!session) return null;

  const [user] = await db
    .select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) return null;

  return {
    userId: session.userId,
    isAdmin: session.isAdmin,
    name: user.name || "Traveller",
    email: user.email,
    phone: user.phone,
  };
}

export async function loginUser(
  phoneOrId: string,
  password: string,
): Promise<{ sessionCookie: string; user: SessionUser } | null> {
  const [user] = await db.select().from(users).where(eq(users.phone, phoneOrId)).limit(1);

  if (!user || !user.passwordHash) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  const token = await signToken({ userId: user.id, isAdmin: user.isAdmin });
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax`;

  return {
    sessionCookie: cookie,
    user: {
      userId: user.id,
      isAdmin: user.isAdmin,
      name: user.name || "Traveller",
      email: user.email,
      phone: user.phone,
    },
  };
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

// ── Require admin middleware – returns user or throws Response ─────────────
export async function requireAdmin(request: Request): Promise<SessionUser> {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!user.isAdmin) {
    throw new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  header.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (name && rest.length) {
      result[name.trim()] = rest.join("=").trim();
    }
  });
  return result;
}
