# Etapa 1: se compila el front con Node (genera la carpeta dist)
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa 2: nginx sirve la carpeta dist y le pasa las peticiones de la API al backend
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
