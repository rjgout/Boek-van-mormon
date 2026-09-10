# Deployen op je Synology NAS via Cloudflare Tunnel

Dit beschrijft hoe je deze app draaiend krijgt op je Synology NAS onder
`bvm.geloofjedatook.nl`, zodanig dat een merge naar `main` op GitHub
automatisch live gaat op de NAS.

## Hoe het in elkaar zit

1. Je merget naar `main` op GitHub.
2. De workflow `.github/workflows/docker-publish.yml` bouwt een Docker-image
   en publiceert die naar GitHub Container Registry (ghcr.io) als
   `ghcr.io/<owner>/boek-van-mormon:latest`.
3. Op de NAS draait een **Watchtower**-container die elke 5 minuten checkt of
   er een nieuwe `latest`-image staat. Zo ja: hij haalt 'm op en herstart de
   app-container automatisch — geen actie op de NAS nodig.
4. Je bestaande **cloudflared**-container (Cloudflare Tunnel) stuurt verkeer
   voor `bvm.geloofjedatook.nl` door naar de app-container, op hetzelfde
   Docker-netwerk.

De SQLite-database staat in een map die je als volume mount, dus die
overleeft elke update van de image.

## Stap 1 — Eenmalig: package publiek maken op GitHub

Zodra de workflow voor het eerst gedraaid heeft na een merge naar `main`
(check: tabblad *Actions* in de repo):

1. Ga naar je GitHub-profiel/organisatie → **Packages** → `boek-van-mormon`.
2. **Package settings** → **Change visibility** → **Public**.

Dit is nodig zodat de NAS de image kan ophalen zonder in te loggen bij ghcr.io.

## Stap 2 — Map voorbereiden op de NAS

Maak via File Station (of SSH) een map, bijvoorbeeld:

```
/volume1/docker/bvm/
├── docker-compose.yml
├── .env
└── data/          <- wordt gebruikt voor de SQLite-database
```

Kopieer `deploy/docker-compose.yml` en `deploy/.env.example` uit deze repo
naar die map (hernoem `.env.example` naar `.env`).

In `docker-compose.yml`: vervang `<OWNER>` door je GitHub-gebruikersnaam in
kleine letters.

In `.env`: vul een echte, geheime `SESSION_SECRET` in (bv. gegenereerd met
`openssl rand -hex 32` — kan ook op je eigen laptop). Laat `SEED_DEMO_USERS`
weg of op `false` — dit is een publieke site, dus geen demo-accounts met een
bekend wachtwoord.

### Het juiste Docker-netwerk vinden

De app moet op hetzelfde Docker-netwerk staan als je cloudflared-container,
zodat de tunnel 'm kan bereiken via `http://bvm-app:3000`. Zoek de
netwerknaam op (via SSH op de NAS):

```bash
docker inspect <naam-van-je-cloudflared-container> --format '{{json .NetworkSettings.Networks}}'
```

Vul de gevonden netwerknaam in bij `cloudflared_net` (het `external: true`
netwerk) in `docker-compose.yml`. Bestaat er nog geen gedeeld netwerk, maak
er dan een aan en sluit je cloudflared-container er ook op aan:

```bash
docker network create bvm-net
```

## Stap 3 — Project importeren in Container Manager

1. Open **Container Manager** → **Project** → **Create**.
2. Kies de map `/volume1/docker/bvm/` en selecteer `docker-compose.yml`.
3. Start het project.

De app-container draait nu `prisma migrate deploy` bij het opstarten en
start daarna de server — de database wordt automatisch op de juiste versie
gezet.

## Stap 4 — Content laden (eenmalig, en na elke content-update)

De demo-parafrases (zie de auteursrechtnotitie in de hoofd-README) laden of
je eigen (toegestane) brontekst importeren doe je door een commando in de
draaiende container uit te voeren:

```bash
# Demo-content:
docker exec bvm-app npm run db:seed

# Of je eigen JSON-bestand (kopieer het eerst de container in):
docker cp mijn-boek-van-mormon.json bvm-app:/tmp/import.json
docker exec bvm-app npm run db:import -- /tmp/import.json
```

## Stap 5 — Cloudflare Tunnel: hostname toevoegen

1. Ga naar het [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/)
   → **Networks** → **Tunnels** → je bestaande tunnel → **Public Hostname** → **Add**.
2. Subdomain: `bvm`, Domain: `geloofjedatook.nl`.
3. Service type: **HTTP**, URL: `bvm-app:3000` (de containernaam op het
   gedeelde netwerk — geen `localhost` nodig).
4. Opslaan. Cloudflare zet automatisch de bijbehorende DNS-record.

WebSockets (voor de live multiplayer-quiz) werken hierbij standaard, zonder
extra configuratie.

## Stap 6 — Testen

Open `https://bvm.geloofjedatook.nl` in een browser. Werkt registreren/
inloggen en de lesflow, dan staat alles goed.

## Daarna: updates gaan vanzelf

Elke merge naar `main` → nieuwe image op ghcr.io → Watchtower op de NAS
haalt 'm binnen ~5 minuten op en herstart de app. Je ziet dit terug in de
Watchtower-logs (`docker logs bvm-watchtower`).

**Let op bij schemawijzigingen**: nieuwe Prisma-migraties in `prisma/migrations/`
worden automatisch toegepast bij het opstarten (`prisma migrate deploy`).
Zorg dus altijd dat je lokaal `npm run db:migrate:dev -- --name <omschrijving>`
draait (en de gegenereerde migratie meecommit) in plaats van rechtstreeks het
schema aan te passen — anders mist de NAS de wijziging.

## Back-ups

De hele database is één bestand: `data/prod.db` in de projectmap op de NAS.
Neem die map mee in je bestaande Synology-back-upplan (Hyper Backup e.d.).
