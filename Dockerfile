FROM node:16-alpine

WORKDIR /usr/app

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python3 make g++
RUN npm install express body-parser

COPY ./server.js .

EXPOSE 3000

CMD [ "node", "server.js" ]
