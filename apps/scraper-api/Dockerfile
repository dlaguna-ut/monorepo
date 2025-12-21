FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy the entire monorepo content
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter scraper-api exec prisma generate

# Build the application
RUN pnpm --filter scraper-api build

# Production image
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/scraper-api/dist ./apps/scraper-api/dist
COPY --from=base /app/apps/scraper-api/package.json ./apps/scraper-api/package.json
COPY --from=base /app/apps/scraper-api/prisma ./apps/scraper-api/prisma
# Copy app node_modules just in case there are unhoisted dependencies or symlinks
COPY --from=base /app/apps/scraper-api/node_modules ./apps/scraper-api/node_modules

# Expose port (default NestJS port is usually 3000, but app might config it)
EXPOSE 3000

CMD ["node", "apps/scraper-api/dist/main.js"]
