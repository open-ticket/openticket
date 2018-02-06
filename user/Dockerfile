FROM node:carbon-alpine

ENV TINI_VERSION v0.16.1
ENV PORT 3000
ENV NODE_ENV production

WORKDIR /usr/src/app

RUN apk add --no-cache tini
RUN apk add --no-cache python
ENTRYPOINT [ "/sbin/tini", "--" ]

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

EXPOSE ${PORT}

USER node
CMD [ "/usr/local/bin/yarn", "start" ]