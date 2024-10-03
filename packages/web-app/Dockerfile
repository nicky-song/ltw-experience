FROM node:18-alpine

RUN apk add --no-cache --update bash

RUN npm install -g npm@9.6.1

COPY ./docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app

CMD ["yarn", "start"]
