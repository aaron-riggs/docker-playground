# ~~~ build phase ~~~

FROM node:dubnium-alpine as build

WORKDIR '/app'

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# ~~~ deploy phase ~~~

FROM nginx:mainline-alpine as deploy

COPY --from=build /app/build /usr/share/nginx/html
