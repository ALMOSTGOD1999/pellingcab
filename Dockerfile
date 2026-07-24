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

# Copy only what's needed to run
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
