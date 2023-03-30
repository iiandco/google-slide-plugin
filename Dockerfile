FROM alpine:latest AS compile

RUN apk update && apk add npm nodejs
WORKDIR /app
COPY ./package*.json /app/
RUN npm install --force
COPY . /app/
RUN npm run build

FROM nginx:alpine
COPY --from=compile /app/build/ /public/
WORKDIR /public
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY ./nginx-def.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx"]