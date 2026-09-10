# Deployen op je Synology NAS via Cloudflare Tunnel

Dit beschrijft hoe je deze app draaiend krijgt op je Synology NAS onder je
eigen domein (bv. `bom.jouwdomein.nl`), zodanig dat een merge naar `main` op
GitHub automatisch live gaat op de NAS.

## Hoe het in elkaar zit

1. Je merget naar `main` op GitHub.
2. De workflow `.github/workflows/docker-publish.yml` bouwt een Docker-image
   en publiceert die naar GitHub Container Registry (ghcr.io) als
   `ghcr.io/<owner>/bom-app:latest`.
3. Op de NAS draaien drie containers: `bom-app` (de applicatie), `bom-db`
   (PostgreSQL, met alle persistente data) en `bom-redis` (Socket.io-adapter
   voor de live multiplayer-quiz). Een vierde, **Watchtower**, checkt elke 5
   minuten of er een nieuwe `bom-app`-image staat. Zo ja: hij haalt 'm op en
   herstart die ene container automatisch — `bom-db` en `bom-redis` blijven
   gewoon draaien, geen actie op de NAS nodig.
4. Je bestaande **cloudflared**-container (Cloudflare Tunnel) stuurt verkeer
   voor jouw domein door naar de `bom-app`-container, op hetzelfde
   Docker-netwerk.

Alle persistente data (gebruikers, wachtwoorden, leesvoortgang, XP, streaks,
freezes, vrienden, competitie, quizresultaten, content, instellingen) staat
in PostgreSQL, in een Docker-volume dat losstaat van de containers. Je kan
`bom-app` (of `bom-db`/`bom-redis`) probleemloos verwijderen en opnieuw
starten — zolang je het volume `bom_db_data` niet verwijdert, blijft alles
behouden.

## Stap 1 — Eenmalig: package publiek maken op GitHub

Zodra de workflow voor het eerst gedraaid heeft na een merge naar `main`
(check: tabblad *Actions* in de repo):

1. Ga naar je GitHub-profiel/organisatie → **Packages** → `bom-app`.
2. **Package settings** → **Change visibility** → **Public**.

Dit is nodig zodat de NAS de image kan ophalen zonder in te loggen bij ghcr.io.

## Stap 2 — Map voorbereiden op de NAS

Maak via File Station (of SSH) een map, bijvoorbeeld:

```
/volume1/docker/bom/
├── docker-compose.yml
└── .env
```

Kopieer `deploy/docker-compose.yml` en `deploy/.env.example` uit deze repo
naar die map (hernoem `.env.example` naar `.env`).

In `docker-compose.yml`: vervang `<OWNER>` door je GitHub-gebruikersnaam in
kleine letters.

In `.env`: vul een echte `POSTGRES_PASSWORD` en `REDIS_PASSWORD` in
(willekeurige lange strings), en een echte, geheime `SESSION_SECRET` (bv.
gegenereerd met `openssl rand -hex 32` — kan ook op je eigen laptop). Laat
`SEED_DEMO_USERS` weg of op `false` — dit is een publieke site, dus geen
demo-accounts met een bekend wachtwoord.

### Het juiste Docker-netwerk vinden

`bom-app` moet op hetzelfde Docker-netwerk staan als je cloudflared-container,
zodat de tunnel 'm kan bereiken via `http://bom-app:3000`. Zoek de
netwerknaam op (via SSH op de NAS):

```bash
docker inspect <naam-van-je-cloudflared-container> --format '{{json .NetworkSettings.Networks}}'
```

Vul de gevonden netwerknaam in bij `cloudflared_net` (het `external: true`
netwerk) in `docker-compose.yml`. Bestaat er nog geen gedeeld netwerk, maak
er dan een aan en sluit je cloudflared-container er ook op aan:

```bash
docker network create cloudflared_net
```

## Stap 3 — Project importeren in Container Manager

1. Open **Container Manager** → **Project** → **Create**.
2. Kies de map `/volume1/docker/bom/` en selecteer `docker-compose.yml`.
3. Start het project.

`bom-app` wacht via de `depends_on`/`service_healthy`-configuratie tot
`bom-db` en `bom-redis` daadwerkelijk gezond zijn, draait daarna
`prisma migrate deploy` (met een korte automatische retry, voor het geval de
database net iets later klaar is) en start pas dan de server.

## Stap 4 — Content laden (eenmalig, en na elke content-update)

De demo-parafrases (zie de auteursrechtnotitie in de hoofd-README) laden of
je eigen (toegestane) brontekst importeren doe je door een commando in de
draaiende container uit te voeren:

```bash
# Demo-content:
docker exec bom-app npm run db:seed

# Of je eigen JSON-bestand (kopieer het eerst de container in):
docker cp mijn-boek-van-mormon.json bom-app:/tmp/import.json
docker exec bom-app npm run db:import -- /tmp/import.json
```

## Stap 5 — Cloudflare Tunnel: hostname toevoegen

1. Ga naar het [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/)
   → **Networks** → **Tunnels** → je bestaande tunnel → **Public Hostname** → **Add**.
2. Kies je subdomain en domein (bv. `bom` op `jouwdomein.nl`).
3. Service type: **HTTP**, URL: `bom-app:3000` (de containernaam op het
   gedeelde netwerk — geen `localhost` nodig).
4. Opslaan. Cloudflare zet automatisch de bijbehorende DNS-record.

WebSockets (voor de live multiplayer-quiz) werken hierbij standaard, zonder
extra configuratie.

## Stap 6 — Testen

Open je domein in een browser. Werkt registreren/inloggen en de lesflow, dan
staat alles goed. Je kan de status van alle containers ook checken met
`docker ps` — `bom-app`, `bom-db` en `bom-redis` moeten alle drie
`(healthy)` tonen.

## Daarna: updates gaan vanzelf

Elke merge naar `main` → nieuwe `bom-app`-image op ghcr.io → Watchtower op
de NAS haalt 'm binnen ~5 minuten op en herstart alleen `bom-app` (`bom-db`
en `bom-redis` blijven gewoon draaien, dus geen downtime van de database).
Je ziet dit terug in de Watchtower-logs (`docker logs bom-watchtower`).

**Let op bij schemawijzigingen**: nieuwe Prisma-migraties in
`prisma/migrations/` worden automatisch toegepast bij het opstarten
(`prisma migrate deploy`). Zorg dus altijd dat je lokaal `npm run
db:migrate:dev -- --name <omschrijving>` draait (en de gegenereerde migratie
meecommit) in plaats van rechtstreeks het schema aan te passen — anders mist
de NAS de wijziging.

## Back-ups

Gebruik de meegeleverde scripts (draai ze op de NAS, vanuit de map met je
`docker-compose.yml`/`.env`):

```bash
./scripts/backup.sh          # maakt backups/bom-<tijdstip>.dump
./scripts/restore.sh backups/bom-20260101T000000Z.dump   # herstelt een backup
```

Neem de `backups/`-map mee in je bestaande Synology-back-upplan (Hyper
Backup e.d.), of zet er zelf een periodieke Task Scheduler-taak voor op die
`scripts/backup.sh` aanroept.
