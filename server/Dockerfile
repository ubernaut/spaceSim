FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json .

RUN npm install

COPY . .

CMD [ "node", "server/server.js" ]
