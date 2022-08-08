FROM node:lts-slim AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

COPY . .

RUN npm install glob rimraf

RUN npm ci

RUN npm run build
# RUN MONGO_HOST=mongodb npm run seed

FROM node:lts-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --omit=dev

COPY . .
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]