#!/usr/bin/env bash
# Maakt een backup van de PostgreSQL-database in de bom-db container.
#
# Gebruik:
#   ./scripts/backup.sh [.env-bestand] [doelmap]
#
# Standaard wordt ./.env gelezen (of deploy/.env als die bestaat en ./.env
# niet) voor POSTGRES_USER/POSTGRES_DB, en de dump weggeschreven naar ./backups/.
set -euo pipefail

ENV_FILE="${1:-}"
DEST_DIR="${2:-backups}"
CONTAINER="${BOM_DB_CONTAINER:-bom-db}"

if [ -z "$ENV_FILE" ]; then
  if [ -f ".env" ]; then
    ENV_FILE=".env"
  elif [ -f "deploy/.env" ]; then
    ENV_FILE="deploy/.env"
  fi
fi

POSTGRES_USER="bom"
POSTGRES_DB="bom"
if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
fi

mkdir -p "$DEST_DIR"
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
outfile="$DEST_DIR/bom-${timestamp}.dump"

echo "Backup van database '${POSTGRES_DB}' (container: ${CONTAINER}) -> ${outfile}"
docker exec "$CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom > "$outfile"
echo "Klaar: ${outfile} ($(du -h "$outfile" | cut -f1))"
