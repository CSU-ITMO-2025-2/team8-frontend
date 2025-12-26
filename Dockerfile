FROM node:25.2.1-alpine AS base

WORKDIR /app

COPY . ./
RUN npm ci
RUN npm run build
EXPOSE 4173
CMD npm run preview

