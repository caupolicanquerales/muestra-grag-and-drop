ARG PROJECT_NAME=muestra-grag-and-drop
ARG NODE_VERSION=24.10.0
ARG BUILD_CONFIGURATION=development

FROM node:${NODE_VERSION} AS build
ARG PROJECT_NAME
ARG BUILD_CONFIGURATION

WORKDIR /app
COPY package*.json ./
RUN npm ci --silent

COPY . .
# Build default configuration and the localized (es) build so both are available
RUN npm run build -- --configuration=${BUILD_CONFIGURATION} --base-href / --output-path=dist/${PROJECT_NAME} \
 && npm run build -- --configuration=es --base-href / --output-path=dist/${PROJECT_NAME}

FROM nginx:stable-alpine AS local
ARG PROJECT_NAME
RUN rm -rf /usr/share/nginx/html/*

# Copy built files (includes localized subfolders such as /es/)
COPY --from=build /app/dist/${PROJECT_NAME}/browser/ /usr/share/nginx/html/
# Also copy from the root dist in case the build output isn't nested under `browser/`
COPY --from=build /app/dist/${PROJECT_NAME}/ /usr/share/nginx/html/

# Install envsubst for runtime nginx template substitution
RUN apk add --no-cache gettext

# Use a template for nginx config and an entrypoint to substitute the locale prefix
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Ensure nginx can read web files (set permissive read/execute for directories)
RUN chmod -R 755 /usr/share/nginx/html || true

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]