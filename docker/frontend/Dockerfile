# Build Environment
FROM node:10.15.3-alpine as build-environment
ENV NODE_ENV development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY packages/frontend/package.json yarn.lock ./
COPY packages/tsconfig.settings.json ./..
RUN yarn
COPY packages/frontend/ .
RUN yarn build

# Production Environment
FROM nginx:alpine as production-environment
ENV NODE_ENV production
ENV DOCKERENV true

COPY --chown=nginx:nginx --from=build-environment /usr/src/app/build /var/www
COPY docker/frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
