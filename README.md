# Geloof je dat ook? — Boek van Mormon

Op een speelse, motiverende manier het Boek van Mormon lezen — in het Nederlands.

Gebouwd om **zelf gehost** te worden: een self-contained Docker-opzet met
een echte PostgreSQL-database en persistente volumes, zonder afhankelijkheid
van een specifieke cloud-hostingprovider.

## Functionaliteit

- **Accounts & sessies**: registreren/inloggen/account verwijderen (AVG) via een httpOnly session-cookie.
- **Privacyvriendelijke gebruikersnaam**: je gebruikersnaam wordt bij registratie
  automatisch aangevuld met een uniek nummer (bv. `Jan#83173`), zodat
  iedereen dezelfde naam kan kiezen en je nooit je e-mailadres hoeft te
  delen om door vrienden gevonden te worden. Vindbaar via e-mailadres is een
  losse instelling op je profiel, standaard uit.
- **Reader**: hoofdstukken lezen met een duidelijk kruimelpad (Boek → Hoofdstuk),
  instelbare lettergrootte, donkere modus, bladwijzers, highlights, eigen
  notities per vers, en een zoekfunctie over de hele tekst.
- **Oefeningen**: ontbrekend woord kiezen uit meerkeuze-opties, woorden in de
  juiste volgorde aantikken, en waar/niet-waar — bewust **nooit typen**, zodat
  spelling nooit in de weg zit. Je ziet direct per vraag of het goed was
  (met het juiste antwoord erbij) vóórdat je doorgaat, en aan het einde van
  de les een "Leermomenten"-scherm om gemiste vragen nog eens te proberen
  (of over te slaan). Elke oefening is gekoppeld aan een concreet vers
  (`sourceVerseId`) en heeft een content-status (`APPROVED`/`DRAFT`/...) als
  fundament voor een latere handmatige-of-AI-controleworkflow.
- **XP**: elke mutatie is een auditbare `XPTransaction` (niet zomaar een
  teller) — reden, bedrag en tijdstip zijn altijd te herleiden.
- **Dag-streak & streak freezes**: je verdient freezes door mijlpalen te
  halen (een 7-daagse streak, of elke 10 voltooide hoofdstukken), ze
  beschermen automatisch je streak als je een dag mist, en je kan ze
  weggeven aan vrienden.
- **Vrienden**: verzoeken sturen/accepteren, elkaars streak en XP zien.
- **Wekelijkse competitie met divisies**: Bronze/Silver/Gold/Platinum/Diamond;
  de top promoveert, de onderkant degradeert aan het einde van de week
  (berekend zodra je voor het eerst die week actief wordt — geen aparte
  cron-taak nodig).
- **Achievements**: badges voor mijlpalen (eerste week-streak, eerste
  hoofdstuk, 1000 XP, eerste freeze verdiend/weggegeven, eerste vriend,
  eerste gewonnen duel), zichtbaar op je profiel.
- **Live multiplayer-quiz**: maak een spel aan voor een hoofdstuk, nodig
  vrienden uit (real-time pop-up als ze de site open hebben, of deel de
  code), en speel gelijktijdig dezelfde invuloefeningen met een live
  scorebord (via Socket.io, met Redis als adapter).
- **Privacy**: alleen functioneel noodzakelijke cookies (geen tracking, dus
  geen cookiebanner nodig), een privacy- en cookiebeleid, en zelf je account
  + alle gegevens kunnen verwijderen.
- **Adminbeheer** (`/adminbackend`): de allereerste ECHTE registratie op een
  verse installatie wordt automatisch admin (geen aparte setup-stap nodig,
  en demo-accounts uit `db:seed` tellen hier niet voor mee); die admin ziet
  een overzicht met statistieken (gebruikers/boeken/hoofdstukken/oefeningen),
  kan andere gebruikers admin maken, en kan een wachtwoordreset voor een
  gebruiker initiëren (er is geen e-mailflow — de admin geeft het getoonde
  tijdelijke wachtwoord zelf door; de gebruiker moet er bij de eerstvolgende
  login direct een eigen wachtwoord voor kiezen).

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
docker exec bom-game npm run db:seed
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
docker exec bom-game npm run db:import -- /pad/naar/bestand.json
```

(kopieer het bestand eerst de container in met `docker cp`). Zie de
comments in `prisma/import.ts` voor het verwachte JSON-formaat.

## Architectuur

| Container    | Rol                                                                 | Persistent? |
|--------------|----------------------------------------------------------------------|-------------|
| `bom-game`   | Next.js-app + API-routes + de live-quiz Socket.io-server            | Nee — stateless, vervangbaar zonder dataverlies |
| `bom-db`     | PostgreSQL — alle gebruikers, voortgang, XP, streaks, freezes, vrienden, competitie, quizresultaten en content | Ja — Docker-volume `bom_db_data` |
| `bom-redis`  | Redis, actief gebruikt als Socket.io-adapter voor de live multiplayer-quiz | Nee — tijdelijke, vervangbare realtime-state |

`bom-game` is bewust stateless: hij is op elk moment te verwijderen en opnieuw
te starten (bv. bij een update) zonder dataverlies, omdat alle persistente
data in `bom-db` staat. Redis wordt écht gebruikt (niet als ongebruikte
infrastructuur): elke room-broadcast van de live-quiz loopt via de
Socket.io-Redis-adapter, wat het ook mogelijk maakt om later — zonder de
multiplayer-architectuur te herbouwen — meerdere `bom-game`-instanties
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

## Beperkingen van deze versie / bewuste scope voor latere fasen

- Live-spel-uitnodigingen komen alleen real-time binnen bij vrienden die op
  dat moment de site open hebben; anders deel je de speelcode handmatig.
- Er draait momenteel één `bom-game`-instantie: de Redis-adapter zorgt dat
  Socket.io-broadcasts er al klaar voor zijn, maar het live-spel-geheugen
  zelf (spelersscores tijdens een actief spel) leeft nog in het geheugen van
  die ene instantie — voor meerdere instanties tegelijk zou dat ook naar
  Redis moeten verhuizen.
- Het datamodel heeft al `Person`/`Place`/`Topic` (en de koppeltabellen naar
  verzen) als fundament, maar er zijn nog geen profielpagina's of
  thema-filters gebouwd.
- Geen leesplannen, geen AI-contentworkflow (het `status`-veld op `Exercise`
  staat er wel klaar voor), geen podcastkoppeling, en nog geen extra
  spelmodi naast het Schriftduel (verspuzzel/blitz/streak battle e.d.).

## Zelf hosten op een Synology NAS (Docker + Cloudflare Tunnel)

Zie [`docs/DEPLOY-SYNOLOGY.md`](docs/DEPLOY-SYNOLOGY.md) voor een volledig
uitgewerkt voorbeeld: een Docker-image die via GitHub Actions automatisch
gebouwd en gepubliceerd wordt zodra je naar `main` pusht, en die je met één
klik in Portainer ophaalt en herstart — plus hoe je 'm onder je eigen domein
achter een Cloudflare Tunnel zet. Dezelfde aanpak werkt met kleine
aanpassingen op elke andere Docker-host.
