# Stage 1: build
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

RUN npm ci

COPY . . 

RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production 

# Stage 2: Serve with nginx
FROM nginx:alpine AS production-stage


RUN rm -rf /usr/share/nginx/html/*

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

# Start nginx
CMD [ "nginx", "-g", "daemon off;" ]
