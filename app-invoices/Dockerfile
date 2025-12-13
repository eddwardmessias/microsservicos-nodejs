FROM node:lts-alpine AS base

FROM base AS deps

WORKDIR /app

# Copy manifests from the service folder so npm finds package.json
COPY app-orders/package*.json ./

RUN npm install --omit=dev

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

RUN chown api:nodejs .

# Copy the service source code
COPY --chown=api:nodejs app-orders .
COPY --from=deps /app/node_modules ./node_modules

USER api

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT [ "npm", "run", "start" ]