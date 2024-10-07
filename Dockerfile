FROM node:18.12.1-bullseye-slim

WORKDIR /usr/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3060

CMD ["node", "index.js"]