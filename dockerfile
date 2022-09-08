FROM node:11

RUN apt update && apt install -y libgl-dev libxi-dev

WORKDIR /srv

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "app/server.js"]
