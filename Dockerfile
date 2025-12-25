FROM node:25.2.1-alpine AS base

WORKDIR /app

COPY . ./
RUN npm ci

EXPOSE 4173
CMD npm run build && npm run preview

