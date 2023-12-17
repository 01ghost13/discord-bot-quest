FROM node:21.4.0-alpine3.19

RUN apk add --no-cache curl imagemagick

WORKDIR /app
