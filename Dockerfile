FROM node:18

RUN apt update && apt install -y libgl-dev libxi-dev python

WORKDIR /srv

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "app/server.js"]
