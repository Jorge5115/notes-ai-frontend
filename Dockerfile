# Etapa 1: build — instala dependencias y genera los archivos estáticos
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: runtime — Nginx solo sirve los archivos estáticos generados
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
