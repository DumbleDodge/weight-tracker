# ETAPA 1: Construcción (Build)
FROM node:18-alpine as build

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# ARGUMENTOS DE CONSTRUCCIÓN (Para que Vite vea las variables de entorno al compilar)
# Esto es importante: Vite necesita las variables AL CONSTRUIR, no al ejecutar.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

# Establecemos las variables de entorno para el build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

# Construimos la app (carpeta dist)
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx (paso siguiente)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos generados en la etapa anterior a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]