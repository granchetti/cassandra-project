FROM node:23-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npx", "ts-node", "src/index.ts"]
