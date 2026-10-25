FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@10.12.4 --activate && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.mjs"]
