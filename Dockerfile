FROM nginx:alpine


RUN rm -rf /usr/share/nginx/html/*

COPY dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

# Start nginx
CMD [ "nginx", "-g", "daemon off;" ]
