# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
# openssl/libc6-compat: benodigd door de Prisma query engine op Alpine (musl)
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./
COPY next.config.js ./
COPY tsconfig.json ./
COPY server.ts ./
COPY src ./src
COPY prisma ./prisma
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
