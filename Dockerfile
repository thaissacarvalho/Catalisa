# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# Operational image used by one-shot jobs such as migrations and bootstrap.
# It intentionally keeps dev dependencies because sequelize-cli and ts-node are
# development tools and are not needed by the long-running API container.
FROM dependencies AS operations
ENV NODE_ENV=production

COPY .sequelizerc nest-cli.json tsconfig.json tsconfig.build.json ./
COPY migrations ./migrations
COPY scripts ./scripts
COPY seeders ./seeders
COPY src ./src

USER node
CMD ["npm", "run", "db:migrate"]

FROM dependencies AS test
ENV NODE_ENV=test

COPY .sequelizerc jest.config.cjs jest.integration.config.cjs nest-cli.json tsconfig.json tsconfig.build.json ./
COPY migrations ./migrations
COPY scripts ./scripts
COPY seeders ./seeders
COPY src ./src
COPY test ./test

CMD ["npm", "run", "test:integration"]

FROM node:${NODE_VERSION}-bookworm-slim AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
