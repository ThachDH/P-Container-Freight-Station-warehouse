# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14-alpine as build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
# RUN npm install --dev compression-webpack-plugin
# RUN npm audit fix

COPY . .

#RUN npm run-script prebuild
RUN npm run build
ENV SOCKET_PATH=https://socketcfs-dev.cehcloud.net
ENV SOCKET_HOST=https://socketcfs-dev.cehcloud.net

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/build/ /usr/share/nginx/html
#COPY --from=build-stage /app/assets /usr/share/nginx/html/assets
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf
# Verify statics assets exist on /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
