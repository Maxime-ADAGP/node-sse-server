FROM node:18-alpine

WORKDIR /usr/app

ENV PORT=3000
ENV JWT_SECRET=

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python3 make g++
COPY ./package*.json .
RUN npm install --omit=dev

COPY ./server.js .
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:${PORT}/status || exit 1

CMD [ "npm", "start" ]
