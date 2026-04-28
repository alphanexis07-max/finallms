#!/usr/bin/env bash
set -euo pipefail

cp ./nginx/conf.d/app-https.conf ./nginx/conf.d/app-http.conf

docker compose up -d nginx
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload

echo "HTTPS config enabled and Nginx reloaded."
