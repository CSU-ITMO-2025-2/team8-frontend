FROM node:25.2.1-alpine AS base

WORKDIR /app

COPY . ./
RUN npm ci

#EXPOSE 5173
#CMD ["npm", "run", "dev", "--", "--host"]

EXPOSE 4173
CMD npm run build && npm run preview

