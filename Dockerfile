# ETAPA 1: Construcción
FROM node:18-alpine as build

WORKDIR /app

# Dependencias
COPY package*.json ./
RUN npm install

# Código fuente
COPY . .

# --- CAMBIO: RESTAURAMOS ARGUMENTOS DINÁMICOS ---
# Definimos que esperamos recibir estos argumentos
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

# Los convertimos en variables de entorno para que Vite los vea al construir
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY
# -----------------------------------------------

# Construimos la app (Ahora Vite leerá las variables de arriba)
RUN npm run build

# ETAPA 2: Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]