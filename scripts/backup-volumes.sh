#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}"

docker run --rm \
  -v certbot_certs:/source:ro \
  -v "$(pwd)/${BACKUP_DIR}:/backup" \
  alpine:3.22 \
  sh -c "tar -czf /backup/certbot_certs-${TIMESTAMP}.tar.gz -C /source ."

docker run --rm \
  -v certbot_www:/source:ro \
  -v "$(pwd)/${BACKUP_DIR}:/backup" \
  alpine:3.22 \
  sh -c "tar -czf /backup/certbot_www-${TIMESTAMP}.tar.gz -C /source ."

echo "Backup completed in ${BACKUP_DIR}"
