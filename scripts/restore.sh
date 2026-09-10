#!/usr/bin/env bash
# Herstelt een backup (gemaakt met scripts/backup.sh) in de bom-db container.
# LET OP: dit overschrijft de huidige database-inhoud.
#
# Gebruik:
#   ./scripts/restore.sh backups/bom-20260101T000000Z.dump [.env-bestand]
set -euo pipefail

DUMP_FILE="${1:?Gebruik: ./scripts/restore.sh <dump-bestand> [.env-bestand]}"
ENV_FILE="${2:-}"
CONTAINER="${BOM_DB_CONTAINER:-bom-db}"

if [ ! -f "$DUMP_FILE" ]; then
  echo "Bestand niet gevonden: $DUMP_FILE" >&2
  exit 1
fi

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

echo "Dit overschrijft de database '${POSTGRES_DB}' in container '${CONTAINER}' met de inhoud van ${DUMP_FILE}."
read -r -p "Weet je het zeker? Typ 'ja' om door te gaan: " confirm
if [ "$confirm" != "ja" ]; then
  echo "Geannuleerd."
  exit 1
fi

docker exec -i "$CONTAINER" pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < "$DUMP_FILE"
echo "Herstel klaar."
