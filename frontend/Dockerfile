FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app

ARG VITE_API_BASE_URL
ARG VITE_WS_BASE_URL
ARG VITE_API_MAX_CONCURRENCY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_WS_BASE_URL=${VITE_WS_BASE_URL} \
    VITE_API_MAX_CONCURRENCY=${VITE_API_MAX_CONCURRENCY}

RUN npm run build


FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
