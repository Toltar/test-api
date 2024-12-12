ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

FROM base as build

COPY package*.json .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .

RUN npm run build

FROM build as run

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "./dist/index.js" ]
