# Stage 1: Build
FROM node:18-alpine AS build
ARG service
WORKDIR /usr/src/app
COPY $service/package*.json ./$service/
RUN cd $service && npm install --omit=dev
COPY $service/src ./$service/src
COPY shared/auth ./shared/auth

# Stage 2: Production
FROM node:18-alpine AS production
ARG service
WORKDIR /usr/src/app
RUN apk update && apk upgrade --no-cache
# Set non-root user
USER node
COPY --chown=node:node --from=build /usr/src/app/$service/node_modules ./$service/node_modules
COPY --chown=node:node --from=build /usr/src/app/$service/src ./$service/src
COPY --chown=node:node --from=build /usr/src/app/shared ./shared
COPY --chown=node:node --from=build /usr/src/app/$service/package.json ./$service/package.json

EXPOSE 3000
WORKDIR /usr/src/app/$service
CMD ["npm", "start"]
