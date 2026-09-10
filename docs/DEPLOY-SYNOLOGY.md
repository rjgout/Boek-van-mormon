# Deployen op je Synology NAS via Portainer

Je hebt al Cloudflare (Tunnel + domein) en Portainer draaien op je NAS. Deze
app sluit daar gewoon op aan — je hoeft niks in de Cloudflare Tunnel-container
of z'n Docker-netwerk te wijzigen. Alles hieronder gebeurt in Portainer.

## Hoe het in elkaar zit

1. Je pusht naar `main` op GitHub.
2. De workflow `.github/workflows/docker-publish.yml` bouwt een Docker-image
   en publiceert die naar GitHub Container Registry (ghcr.io) als
   `ghcr.io/<owner>/bom-game:latest`.
3. Op de NAS draaien drie containers: `bom-game` (de applicatie), `bom-db`
   (PostgreSQL, met alle persistente data) en `bom-redis` (Socket.io-adapter
   voor de live multiplayer-quiz). Een vierde, **Watchtower**, checkt elke 5
   minuten of er een nieuwe `bom-game`-image staat. Zo ja: hij haalt 'm op en
   herstart die ene container automatisch — `bom-db` en `bom-redis` blijven
   gewoon draaien, geen actie op de NAS nodig.
4. `bom-game` publiceert poort 3000 rechtstreeks op je NAS. Jij wijst je
   eigen, al bestaande Cloudflare Tunnel naar `<NAS-IP>:3000` — dat regel je
   zelf in het Cloudflare Zero Trust-dashboard, niet in Docker.

Alle persistente data (gebruikers, wachtwoorden, leesvoortgang, XP, streaks,
freezes, vrienden, competitie, quizresultaten, content, instellingen) staat
in PostgreSQL, in een map op je NAS die losstaat van de containers. Je kan
`bom-game` (of `bom-db`/`bom-redis`) probleemloos verwijderen en opnieuw
starten zonder dataverlies.

## Stap 1 — Eenmalig: package publiek maken op GitHub

Zodra de workflow voor het eerst gedraaid heeft na een push naar `main`
(check: tabblad *Actions* in de repo):

1. Ga naar je GitHub-profiel → **Packages** → `bom-game`.
2. **Package settings** → **Change visibility** → **Public**.

Dit is nodig zodat de NAS de image kan ophalen zonder in te loggen bij ghcr.io.

## Stap 2 — Stack toevoegen in Portainer

1. Open Portainer → **Stacks** → **Add stack**.
2. Naam: `bom-game`.
3. Build method: **Web editor**.
4. Open [`deploy/docker-compose.yml`](../deploy/docker-compose.yml) uit deze
   repo, kopieer de inhoud en plak 'm in het Web editor-veld.
5. Vervang drie placeholders (zoek ze op met Ctrl+F — sommige komen op 2-3
   plekken voor en moeten daar overal hetzelfde blijven):
   - `CHANGE_THIS_DB_PASSWORD` → een zelfverzonnen wachtwoord voor de database
   - `CHANGE_THIS_REDIS_PASSWORD` → een zelfverzonnen wachtwoord voor Redis
   - `CHANGE_THIS_TO_A_LONG_RANDOM_STRING` → een lange, geheime willekeurige
     string (bv. gegenereerd met `openssl rand -hex 32` op je laptop)
6. Klik **Deploy the stack**.

Portainer trekt nu de drie images (`bom-game`, `postgres:16-alpine`,
`redis:7-alpine`, plus `watchtower`) en start alles. `bom-game` wacht via de
`depends_on`/`service_healthy`-configuratie tot `bom-db` en `bom-redis`
daadwerkelijk gezond zijn, draait daarna automatisch de database-migraties
(met een korte automatische retry) en start pas dan de server.

Je kan de voortgang volgen bij **Stacks → bom-game → Containers**, of per
container op **Logs** klikken.

## Stap 3 — Content laden (eenmalig, en na elke content-update)

Ga naar **Containers → bom-game → Console**, kies `/bin/sh`, **Connect**, en
draai daarin:

```bash
npm run db:seed
```

Dit laadt de demo-parafrases (zie de auteursrechtnotitie in de hoofd-README).
Heb je een eigen (toegestaan) bronbestand, kopieer dat dan eerst naar de
container (**Containers → bom-game → Volumes**, of `docker cp` via SSH) en
draai vervolgens `npm run db:import -- /pad/naar/bestand.json`.

## Stap 4 — Cloudflare: domein naar de NAS wijzen

Dit doe je volledig in je eigen, al bestaande Cloudflare-omgeving — niks in
Docker hoeft hiervoor aangepast te worden:

1. Maak (of gebruik) je domein/subdomein bij Cloudflare.
2. Wijs 'm naar je NAS op poort **3000** (via je bestaande Tunnel, of hoe je
   dat verder al geregeld hebt).

WebSockets (voor de live multiplayer-quiz) werken hierbij standaard, zonder
extra configuratie.

## Stap 5 — Testen

Open je domein in een browser. Werkt registreren/inloggen en de lesflow, dan
staat alles goed. In Portainer moeten `bom-game`, `bom-db` en `bom-redis`
alle drie een groene/gezonde status tonen.

## Daarna: updates gaan vanzelf

Elke push naar `main` → nieuwe `bom-game`-image op ghcr.io → Watchtower op
de NAS haalt 'm binnen ~5 minuten op en herstart alleen `bom-game` (`bom-db`
en `bom-redis` blijven gewoon draaien, dus geen downtime van de database).
Je ziet dit terug in de logs van de `bom-watchtower`-container.

**Let op bij schemawijzigingen**: nieuwe Prisma-migraties in
`prisma/migrations/` worden automatisch toegepast bij het opstarten
(`prisma migrate deploy`) — daar hoef je zelf niets voor te doen op de NAS.

## Back-ups

De database staat op je NAS onder `/volume1/docker/bom-game/postgres` (zie
het `volumes:`-pad in `deploy/docker-compose.yml`) — neem die map mee in je
bestaande Synology-back-upplan (Hyper Backup e.d.).

Wil je liever een los, herstelbaar databasedump-bestand, gebruik dan de
meegeleverde scripts (`scripts/backup.sh` / `scripts/restore.sh`) — die
werken op elke Docker-host, ook je NAS via SSH.
