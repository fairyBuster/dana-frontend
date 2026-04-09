FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM caddy:2.7-alpine
ENV BACKEND_DOMAIN=example.com
ENV BACKEND_SCHEME=https
ENV ALLOWED_IPS="127.0.0.1 ::1"
RUN mkdir -p /var/www/frontend-spa/dist /var/log/caddy && chown -R caddy:caddy /var/www /var/log/caddy
COPY --from=build /app/dist /var/www/frontend-spa/dist
COPY deploy/caddy/Caddyfile.env /etc/caddy/Caddyfile
EXPOSE 80
USER caddy
CMD ["caddy","run","--config","/etc/caddy/Caddyfile","--adapter","caddyfile"]
