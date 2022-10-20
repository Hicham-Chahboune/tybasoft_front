FROM node:16.16.0-alpine3.16 as build

RUN npm install -g npm@8.19.2

RUN mkdir -p /app

WORKDIR /app

COPY package*.json .
RUN npm install -f

COPY . .

RUN npm run build --prod

CMD ["npm","start"]

FROM nginx:alpine

COPY --from=build /app/dist/final /usr/share/nginx/html

EXPOSE 80



