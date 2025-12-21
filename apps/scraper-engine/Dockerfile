FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

# Install dependencies including dev dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm --filter scraper-engine build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install Puppeteer dependencies
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/scraper-engine/dist ./apps/scraper-engine/dist
COPY --from=base /app/apps/scraper-engine/package.json ./apps/scraper-engine/package.json

# Copy root node_modules for hoisted dependencies
COPY --from=base /app/node_modules ./node_modules
# Copy app node_modules just in case there are unhoisted dependencies or symlinks
COPY --from=base /app/apps/scraper-engine/node_modules ./apps/scraper-engine/node_modules

CMD ["node", "apps/scraper-engine/dist/main.js"]
