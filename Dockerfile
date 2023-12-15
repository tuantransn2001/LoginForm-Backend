FROM node:18.5

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8001

CMD npm start

