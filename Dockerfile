FROM node:20-slim AS base

# Install bun for fast installs
RUN npm install -g bun@latest

# ── Dependencies ──────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ── Production ────────────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets, runtime dependencies, and Node.js server wrapper
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/node-server.mjs ./node-server.mjs
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "node-server.mjs"]
