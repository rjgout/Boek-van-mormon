# Deployen op je Synology NAS via Portainer

Je hebt al Cloudflare (Tunnel + domein) en Portainer draaien op je NAS. Deze
app sluit daar gewoon op aan — je hoeft niks in de Cloudflare Tunnel-container
of z'n Docker-netwerk te wijzigen. Alles hieronder gebeurt in Portainer.

## Migreren van een bestaande "bom-game"-installatie

Draait er al een installatie onder de oude naamgeving (`bom-game`/`bom-db`/
`bom-redis`)? Doe dit **vóórdat** je de rest van dit document volgt:

1. Portainer → **Stacks** → `bom-game` → **Stop**.
2. Verplaats op de NAS (File Station of SSH) de map `/volume1/docker/bom-game`
   naar `/volume1/docker/jehova-game` — dus inclusief de `postgres`-submap
   met al je bestaande data.
3. Maak het GitHub-package `jehova-game` publiek (zie **Stap 1** hieronder —
   dat is een eenmalige, nieuwe stap, ook al deed je dat destijds al voor
   `bom-game`).
4. Vervang de inhoud van de bestaande stack door de bijgewerkte
   `deploy/docker-compose.yml` (zie **Stap 2**) en **Update the stack**.
   De Postgres-gebruiker/database blijven bewust "bom" heten — dat is voor
   niemand zichtbaar en hoeft dus niet mee te veranderen.
5. Controleer (**Stap 5**) dat inloggen en je bestaande voortgang nog werken
   vóórdat je de oude, nu ongebruikte map `/volume1/docker/bom-game`
   definitief verwijdert.

## Hoe het in elkaar zit

1. Je pusht naar `main` op GitHub.
2. De workflow `.github/workflows/docker-publish.yml` bouwt een Docker-image
   en publiceert die naar GitHub Container Registry (ghcr.io) als
   `ghcr.io/<owner>/jehova-game:latest`.
3. Op de NAS draaien drie containers: `jehova-game` (de applicatie),
   `jehova-db` (PostgreSQL, met alle persistente data) en `jehova-redis`
   (Socket.io-adapter voor de live multiplayer-quiz). Updaten naar een
   nieuwe versie doe je zelf met één klik in Portainer (zie **Daarna:
   updaten** hieronder) — er draait geen automatische updater.
4. `jehova-game` publiceert poort 3000 rechtstreeks op je NAS. Jij wijst je
   eigen, al bestaande Cloudflare Tunnel naar `<NAS-IP>:3000` — dat regel je
   zelf in het Cloudflare Zero Trust-dashboard, niet in Docker.

Alle persistente data (gebruikers, wachtwoorden, leesvoortgang, XP, streaks,
freezes, vrienden, competitie, quizresultaten, content, instellingen) staat
in PostgreSQL, in een map op je NAS die losstaat van de containers. Je kan
`jehova-game` (of `jehova-db`/`jehova-redis`) probleemloos verwijderen en
opnieuw starten zonder dataverlies.

## Stap 1 — Eenmalig: package publiek maken op GitHub

Zodra de workflow voor het eerst gedraaid heeft na een push naar `main`
(check: tabblad *Actions* in de repo):

1. Ga naar je GitHub-profiel → **Packages** → `jehova-game`.
2. **Package settings** → **Change visibility** → **Public**.

Dit is nodig zodat de NAS de image kan ophalen zonder in te loggen bij ghcr.io.

## Stap 2 — Stack toevoegen in Portainer

1. Open Portainer → **Stacks** → **Add stack**.
2. Naam: `jehova-game`.
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

Portainer trekt nu de drie images (`jehova-game`, `postgres:16-alpine` en
`redis:7-alpine`) en start alles. `jehova-game` wacht via de
`depends_on`/`service_healthy`-configuratie tot `jehova-db` en `jehova-redis`
daadwerkelijk gezond zijn, draait daarna automatisch de database-migraties
(met een korte automatische retry) en start pas dan de server.

Je kan de voortgang volgen bij **Stacks → jehova-game → Containers**, of per
container op **Logs** klikken.

## Stap 3 — Content laden (eenmalig, en na elke content-update)

Ga naar **Containers → jehova-game → Console**, kies `/bin/sh`, **Connect**, en
draai daarin:

```bash
npm run db:seed
```

Dit laadt de demo-parafrases (zie de auteursrechtnotitie in de hoofd-README).
Heb je een eigen (toegestaan) bronbestand, kopieer dat dan eerst naar de
container (**Containers → jehova-game → Volumes**, of `docker cp` via SSH) en
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
staat alles goed. In Portainer moeten `jehova-game`, `jehova-db` en
`jehova-redis` alle drie een groene/gezonde status tonen.

## Daarna: updaten

Elke push naar `main` zet een nieuwe `jehova-game`-image klaar op ghcr.io —
die haal je zelf op wanneer het jou uitkomt:

1. Portainer → **Stacks** → `jehova-game`.
2. **Pull and redeploy** (herbouwt alleen `jehova-game` met de nieuwste image;
   `jehova-db` en `jehova-redis` blijven gewoon draaien, dus geen downtime van
   de database).

**Let op bij schemawijzigingen**: nieuwe Prisma-migraties in
`prisma/migrations/` worden automatisch toegepast bij het opstarten
(`prisma migrate deploy`) — daar hoef je zelf niets voor te doen op de NAS.

## Back-ups

De database staat op je NAS onder `/volume1/docker/jehova-game/postgres` (zie
het `volumes:`-pad in `deploy/docker-compose.yml`) — neem die map mee in je
bestaande Synology-back-upplan (Hyper Backup e.d.).

Wil je liever een los, herstelbaar databasedump-bestand, gebruik dan de
meegeleverde scripts (`scripts/backup.sh` / `scripts/restore.sh`) — die
werken op elke Docker-host, ook je NAS via SSH.
