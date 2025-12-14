

# ETAPA 1: Construcción
FROM node:18-alpine as build

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos TODO el código (src, public, etc)
COPY . .

# --- VARIABLES DE ENTORNO (PON LAS TUYAS REALES AQUÍ) ---
ENV VITE_SUPABASE_URL="https://anvrbqvdswjexseirxhb.supabase.co"
ENV VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudnJicXZkc3dqZXhzZWlyeGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDIwMDYsImV4cCI6MjA4MTExODAwNn0.6OStsGMiRnhP4f0xj_Gj54KaUh2HbDEBmLAO2kGXG04"
# ---------------------------------------------------------

# Construimos la app
RUN npm run build

# --- EL CHIVATO: Esto imprimirá en el log de Portainer qué se ha creado ---
RUN echo "--- CONTENIDO DE LA CARPETA DIST ---" && ls -R dist
# -------------------------------------------------------------------------

# ETAPA 2: Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]