#!/bin/sh
envsubst '${BACKEND_HOST}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"