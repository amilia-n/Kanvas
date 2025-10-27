# syntax=docker/dockerfile:1
ARG NODE_VERSION=20
# -------- Stage 1: build native deps --------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Stage 2: minimal runtime --------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 8888
# tini becomes PID 1 (reaps zombies, forwards signals)
ENTRYPOINT ["tini","--"]
CMD npm start
# STOPSIGNAL SIGTERM


