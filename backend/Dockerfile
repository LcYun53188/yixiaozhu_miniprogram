ARG NODE_IMAGE=node:22-alpine
FROM ${NODE_IMAGE} AS base

WORKDIR /app

COPY package*.json ./

FROM base AS deps
RUN npm install

FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM deps AS prod
ENV NODE_ENV=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
