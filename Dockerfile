# ETAPA 1: Construcción (Build)
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# --- CAMBIO AQUÍ: PON TUS CLAVES REALES AQUÍ A FUEGO ---
# (No es la mejor práctica de seguridad, pero para tu servidor casero es seguro y arreglará el error)
ENV VITE_SUPABASE_URL="https://anvrbqvdswjexseirxhb.supabase.co"
ENV VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudnJicXZkc3dqZXhzZWlyeGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDIwMDYsImV4cCI6MjA4MTExODAwNn0.6OStsGMiRnhP4f0xj_Gj54KaUh2HbDEBmLAO2kGXG04"
# -------------------------------------------------------

RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]