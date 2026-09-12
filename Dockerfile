# Clock Years — VPS image (Ubuntu host, Node 22, Nitro node-server preset).
# Build:   docker compose up -d --build
# Run:     migrations run first (re-runnable), then the Node server on $PORT.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:22-slim AS run
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build /app/.output ./.output
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts/migrate.mjs ./scripts/migrate.mjs
COPY --from=build /app/scripts/migration-plan.mjs ./scripts/migration-plan.mjs
EXPOSE 8080
CMD ["sh", "-c", "node scripts/migrate.mjs && node .output/server/index.mjs"]
