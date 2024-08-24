FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8002

CMD [ "npm", "run", "start" ]