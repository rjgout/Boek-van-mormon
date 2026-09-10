# Boek van Mormon

Op een speelse manier het Boek van Mormon lezen — in het Nederlands, Duolingo-stijl.

Gebouwd om **zelf gehost** te worden: een self-contained Docker-opzet met
een echte PostgreSQL-database en persistente volumes, zonder afhankelijkheid
van een specifieke cloud-hostingprovider.

## Functionaliteit

- **Accounts & sessies**: registreren/inloggen met een httpOnly session-cookie.
- **Lessen**: lees een hoofdstuk, beantwoord daarna invuloefeningen (zelf het
  ontbrekende woord typen, of woorden in de juiste volgorde slepen) — **geen
  multiple choice**.
- **Dag-streak**: elke dag studeren houdt je streak in leven.
- **Streak freezes**: je verdient ze door mijlpalen te halen (een 7-daagse
  streak, of elke 10 voltooide hoofdstukken), ze beschermen automatisch je
  streak als je een dag mist, en je kan ze weggeven aan vrienden.
- **Vrienden**: verzoeken sturen/accepteren, elkaars streak en XP zien.
- **Wekelijkse competitie**: ranglijst op XP, wereldwijd of alleen vrienden.
- **Live multiplayer-quiz**: maak een spel aan voor een hoofdstuk, nodig
  vrienden uit (real-time pop-up als ze de site open hebben, of deel de
  code), en speel gelijktijdig dezelfde invuloefeningen met een live
  scorebord (via Socket.io, met Redis als adapter).

## Snel starten met Docker (aanbevolen)

Eén commando start de hele stack: de app, PostgreSQL (met een persistent
volume) en Redis.

```bash
cp .env.example .env
# open .env en vul POSTGRES_PASSWORD, REDIS_PASSWORD en SESSION_SECRET in
docker compose up -d --build
```

De app draait daarna op `http://localhost:3000`. Zet zelf een reverse proxy
(Cloudflare Tunnel, Nginx, Caddy, Traefik, ...) ervoor als je 'm publiek
bereikbaar wil maken onder je eigen domein — zie
[`docs/DEPLOY-SYNOLOGY.md`](docs/DEPLOY-SYNOLOGY.md) voor een volledig
uitgewerkt voorbeeld met een Synology NAS + Cloudflare Tunnel, inclusief
automatische updates.

Content laden (eenmalig, en telkens wanneer je content toevoegt/wijzigt):

```bash
docker exec bom-app npm run db:seed
```

Zie **Architectuur** hieronder voor wat elke container doet, en **Back-ups**
voor hoe je de database veiligstelt.

## Auteursrecht van de brontekst

De tekst van het Boek van Mormon is auteursrechtelijk beschermd door De Kerk
van Jezus Christus van de Heiligen der Laatste Dagen. `prisma/content.ts`
bevat daarom alleen een handvol **zelf geschreven parafrases** als
demo-inhoud — geen letterlijke overname van de officiële vertaling.

Zodra je toestemming hebt geregeld om de officiële tekst te gebruiken, kan
je je eigen content laden via:

```bash
docker exec bom-app npm run db:import -- /pad/naar/bestand.json
```

(kopieer het bestand eerst de container in met `docker cp`). Zie de
comments in `prisma/import.ts` voor het verwachte JSON-formaat.

## Architectuur

| Container    | Rol                                                                 | Persistent? |
|--------------|----------------------------------------------------------------------|-------------|
| `bom-app`    | Next.js-app + API-routes + de live-quiz Socket.io-server            | Nee — stateless, vervangbaar zonder dataverlies |
| `bom-db`     | PostgreSQL — alle gebruikers, voortgang, XP, streaks, freezes, vrienden, competitie, quizresultaten en content | Ja — Docker-volume `bom_db_data` |
| `bom-redis`  | Redis, actief gebruikt als Socket.io-adapter voor de live multiplayer-quiz | Nee — tijdelijke, vervangbare realtime-state |

`bom-app` is bewust stateless: hij is op elk moment te verwijderen en opnieuw
te starten (bv. bij een update) zonder dataverlies, omdat alle persistente
data in `bom-db` staat. Redis wordt écht gebruikt (niet als ongebruikte
infrastructuur): elke room-broadcast van de live-quiz loopt via de
Socket.io-Redis-adapter, wat het ook mogelijk maakt om later — zonder de
multiplayer-architectuur te herbouwen — meerdere `bom-app`-instanties
tegelijk te draaien.

## Lokaal ontwikkelen zonder Docker

```bash
npm install
# start zelf een lokale PostgreSQL en Redis, en zet DATABASE_URL/REDIS_URL
# in .env (zie de voorbeelden onderaan .env.example)
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

Tijdens actieve ontwikkeling van het schema kan `npm run db:push` (zonder
migratiebestanden aan te maken) handiger zijn; gebruik `npm run
db:migrate:dev -- --name <omschrijving>` om een nieuwe migratie vast te
leggen zodra een schemawijziging klaar is voor productie/commit.

## Techstack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma (migrations in `prisma/migrations/`)
- Redis + `@socket.io/redis-adapter` voor de live multiplayer-quiz (via een
  custom server, zie `server.ts` / `src/server/gameServer.ts`)
- Docker Compose met healthchecks, `depends_on: condition: service_healthy`
  en herstart-policies voor alle services

## Back-ups

```bash
./scripts/backup.sh            # -> backups/bom-<tijdstip>.dump
./scripts/restore.sh backups/bom-20260101T000000Z.dump
```

De database staat volledig in het Docker-volume `bom_db_data`. Een
container verwijderen en opnieuw starten laat de data intact; alleen het
expliciet verwijderen van dat volume (`docker volume rm ...`) is destructief.

## Beperkingen van deze versie

- Live-spel-uitnodigingen komen alleen real-time binnen bij vrienden die op
  dat moment de site open hebben; anders deel je de speelcode handmatig.
- De wekelijkse competitie is een eenvoudige XP-ranglijst (geen
  divisies/promoveren zoals bij sommige apps).
- Er draait momenteel één `bom-app`-instantie: de Redis-adapter zorgt dat
  Socket.io-broadcasts er al klaar voor zijn, maar het live-spel-geheugen
  zelf (spelersscores tijdens een actief spel) leeft nog in het geheugen van
  die ene instantie — voor meerdere instanties tegelijk zou dat ook naar
  Redis moeten verhuizen.

## Zelf hosten op een Synology NAS (Docker + Cloudflare Tunnel)

Zie [`docs/DEPLOY-SYNOLOGY.md`](docs/DEPLOY-SYNOLOGY.md) voor een volledig
uitgewerkt voorbeeld: een Docker-image die via GitHub Actions automatisch
gebouwd en gepubliceerd wordt, en op de NAS door Watchtower opgehaald en
herstart wordt zodra je naar `main` merget — plus hoe je 'm onder je eigen
domein achter een Cloudflare Tunnel zet. Dezelfde aanpak werkt met kleine
aanpassingen op elke andere Docker-host.
