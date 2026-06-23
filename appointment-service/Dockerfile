# Stage 1: Build
FROM node:18-alpine AS build
ARG service
WORKDIR /usr/src/app
COPY $service/package*.json ./
RUN npm install --omit=dev
COPY $service/src ./src
COPY shared/auth ./shared/auth

# Stage 2: Production
FROM node:18-alpine AS production
ARG service
WORKDIR /usr/src/app
# Set non-root user
USER node
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/src ./src
COPY --chown=node:node --from=build /usr/src/app/shared ./shared
COPY --chown=node:node $service/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
