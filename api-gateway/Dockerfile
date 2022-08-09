FROM node:lts-slim AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

COPY . .

RUN npm install glob rimraf

RUN npm ci && npm audit fix

RUN npm run build
# RUN MONGO_HOST=mongodb npm run seed

FROM node:lts-slim as production

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --omit=dev && npm audit fix

COPY . .
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]