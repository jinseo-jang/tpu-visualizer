# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy the built assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the container to listen on $PORT (usually 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
