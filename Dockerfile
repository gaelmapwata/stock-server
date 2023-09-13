# BUILD
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

COPY --chown=node:node . .
RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

# STARTER
FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /app

COPY --from=build-stage /app .

EXPOSE 8000

USER node
CMD yarn start
