FROM node:18-alpine

WORKDIR /usr/app

ENV PORT 3000

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python3 make g++
COPY ./package*.json .
RUN npm install

COPY ./server.js .
EXPOSE ${PORT}

CMD [ "node", "server-data.js" ]
