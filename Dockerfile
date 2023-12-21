FROM node:18.17

WORKDIR /app

COPY . .

RUN npm install
RUN npm install --force @img/sharp-linux-arm64

RUN npm run build

EXPOSE 8001

CMD npm start

