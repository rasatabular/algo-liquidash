# build in two stages, one for compiling and one for running the
FROM node:12-alpine AS build

ARG REACT_APP_DOMAIN

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY ./public ./public
COPY ./src ./src

RUN REACT_APP_DOMAIN=${REACT_APP_DOMAIN} npm run build

# create an nginx container for serving the app and copy the build
# from the previous stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
