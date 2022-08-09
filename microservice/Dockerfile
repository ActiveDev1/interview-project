FROM node:lts-slim AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm ci && npm audit fix

FROM node:lts-slim as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm audit fix

COPY . .

CMD ["npm", "start"]
