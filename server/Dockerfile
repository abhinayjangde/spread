FROM node:24-alpine AS base

# Builder Stage
FROM base AS builder

WORKDIR /build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm

COPY package*.json .
COPY prisma.config.ts .
COPY .env .env
COPY tsconfig.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY src/ src/

RUN pnpm run build

# Runner Stage
FROM base AS runner

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm

COPY package*.json .
COPY prisma.config.ts .
COPY .env .env
COPY pnpm-lock.yaml .

COPY --from=builder /build/dist /dist

RUN pnpm install --frozen-lockfile

EXPOSE 9000

RUN adduser --system nodejs
USER nodejs

CMD [ "pnpm", "run", "start" ]