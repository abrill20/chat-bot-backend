FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . .

ENV NODE_BUILD=true

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD node dist