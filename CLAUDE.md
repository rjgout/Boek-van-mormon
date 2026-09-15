# CLAUDE.md

Instructies voor Claude Code bij het werken aan dit project. Voor
functionaliteit/features: zie `README.md`. Voor een uitgewerkt
deployvoorbeeld: zie `docs/DEPLOY-SYNOLOGY.md`.

## Wat dit is

"Geloof je dat ook?" — een Nederlandstalige, Duolingo-achtige leerapp om het
Boek van Mormon te lezen (lessen, oefeningen, XP, streaks, competitie,
live multiplayer-quiz). Bewust gebouwd om **self-hosted** te draaien (geen
cloud-platformafhankelijkheden), taal is overal Nederlands (UI, foutmeldingen,
codecommentaar, commitmessages).

## Techstack

- Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS + React 19
- PostgreSQL + Prisma (migrations in `prisma/migrations/`)
- Redis + `@socket.io/redis-adapter` voor de live multiplayer-quiz
- Custom server (`server.ts`, via `tsx`, geen `next start`) omdat er een
  Socket.io-server naast de Next.js-requesthandler moet draaien
- Auth: eigen implementatie — `jose` (JWT) + `bcryptjs`, geen NextAuth/Clerk/etc.
- **Geen testframework aanwezig** (geen jest/vitest/playwright-dependency, geen
  test-CI-stap). Valideren gebeurt via `npx tsc --noEmit`, handmatig door de
  dev-server heen lopen, en een schone `npm run build` vóór je een taak als
  afgerond beschouwt.

## Architectuur (3 containers, zie `docker-compose.yml` / `README.md`)

| Container | Rol | Persistent? |
|---|---|---|
| `bom-game` | Next.js-app + API + Socket.io-server (`server.ts`) | Nee, stateless |
| `bom-db` | PostgreSQL — alle gebruikersdata | Ja (`bom_db_data`) |
| `bom-redis` | Socket.io-adapter voor live-quiz | Nee, ephemeral |

Build/deploy: GitHub Actions bouwt bij elke push naar `main` een image en
publiceert 'm naar `ghcr.io` (`.github/workflows/docker-publish.yml`); een
zelfgehoste instantie haalt 'm op via Portainer/Docker Compose.

## ⚠️ Harde regel: `server.ts`'s eager-importketen

`server.ts` importeert `src/server/gameServer.ts` en `src/lib/scheduler.ts`
**bovenaan het bestand, vóór `app.prepare()`** — dus vóórdat Next zelf
geïnitialiseerd is, en dat draait via `tsx` (buiten Next's eigen
module-bundeling om). Elke module die transitief via die twee bestanden
meekomt (o.a. `notify.ts`, `baseUrl.ts`, `streak.ts`, `challenges.ts`,
`scrabbleGame.ts`) mag daarom **nooit** een runtime-import bevatten van een
request-scoped Next-API (`next/headers`, `cookies()`/`headers()` uit
`next/server` als waarde, etc.) — dat crasht het hele productieproces bij
opstarten met `Invariant: AsyncLocalStorage accessed in runtime where it is
not available` (in een crash-lus, dus de container komt nooit gezond op).
Zulke APIs zijn alleen veilig in bestanden die uitsluitend via Next's eigen
bundeling geladen worden: `page.tsx`/`layout.tsx`/`route.ts`-bestanden en
alles wat **alleen** daar vandaan geïmporteerd wordt (bv. `session.ts`,
gebruikt via routes, nooit via `server.ts`'s eigen keten).
Controleer bij twijfel: `grep -rn "next/headers" src/lib src/server server.ts`
— hoort leeg te zijn buiten route/page/layout-bestanden.

## Projectstructuur

- `server.ts` — custom entrypoint (HTTP-server + Next-handler + Socket.io)
- `src/server/gameServer.ts` — Socket.io-logica voor live multiplayer (lobby,
  scores, "Raad het hoofdstuk"); state van een lopend spel leeft in-memory
  in deze ene instantie (zie Beperkingen in `README.md`)
- `src/app/**` — App Router: pagina's (`page.tsx`) + API-routes (`app/api/**/route.ts`)
- `src/lib/**` — kernlogica, per domein één bestand (`streak.ts`, `xp.ts`,
  `leagues.ts`, `competitionXp.ts`, `challenges.ts`, `scrabbleGame.ts`,
  `chapterGuess.ts`, `wordGame.ts`, `notify.ts`, `email.ts`, `auth.ts`,
  `session.ts`, `baseUrl.ts`, `dates.ts`, ...)
- `src/components/**` — client components (`"use client"`), meestal één
  `<Feature>Client.tsx` per pagina die de eigen data fetcht
- `prisma/schema.prisma` + `prisma/migrations/**` — datamodel en migraties
- `prisma/seed.ts`, `import.ts`, `importKids.ts`, `importPodcast.ts` — content laden
- `deploy/`, `docs/DEPLOY-SYNOLOGY.md` — self-host-referentiedeploy (Synology + Portainer)

## Database & migraties

- Eén `PrismaClient`-singleton in `src/lib/db.ts` (standaard Next-hot-reload-guard).
- **Migratiebeleid (hard, consistent toegepast)**: een nieuwe migratie mag
  bestaand gedrag/data van bestaande gebruikers nooit met terugwerkende
  kracht veranderen. Nieuwe verplichte/gedrag-bepalende kolommen krijgen in
  dezelfde migratie een backfill (raw SQL) die ze zo vult dat bestaande
  gebruikers het nieuwe gedrag NIET automatisch triggeren (bv.
  `onboardingSeenAt = createdAt` zodat bestaande accounts de onboarding-flow
  nooit alsnog te zien krijgen). Patroon: DDL bovenaan `migration.sql`,
  backfill-`UPDATE`/`INSERT...SELECT` eronder, in hetzelfde bestand.
- Instellingen die een admin via `/adminbackend` aanpast staan in eigen
  singleton-modellen (`id String @id @default("singleton")`) — patroon:
  `EmailSettings`, `LeagueSettings`, `BrandingSettings`, `DetectedAppUrl`.
  Geheimen (SMTP-wachtwoord) staan versleuteld (`src/lib/crypto.ts`, sleutel
  afgeleid van `SESSION_SECRET`), nooit als platte tekst.
- In deze devcontainer: Postgres/Redis starten niet vanzelf, en
  `prisma migrate dev` kan hier "non-interactive environment"-fouten geven —
  gebruik dan `--create-only` (schrijft alleen het SQL-bestand) of schrijf
  `migration.sql` handmatig volgens het patroon hierboven, en pas toe met
  `prisma migrate deploy`.

## Auth & autorisatie

- Sessie = httpOnly JWT-cookie (`bvm_session`, `jose`, 30 dagen), wachtwoorden
  gehasht met `bcryptjs`. Geen aparte rollen-tabel: alleen `User.isAdmin`.
- **De allereerste ECHTE registratie op een verse installatie wordt
  automatisch admin** (geen setup-stap nodig); demo-accounts uit
  `SEED_DEMO_USERS`/`prisma/seed.ts` tellen daar bewust niet voor mee.
- Elke API-route/server-actie die auth nodig heeft begint met
  `getCurrentUser()` (uit `src/lib/session.ts`) → 401 bij `null` → bij
  admin-routes daarna ook `isAdmin` → 403. Er is geen `middleware.ts`; elke
  route/pagina controleert dit zelf.
- Gebruikersidentiteit is `handle#discriminator` (bv. `Jan#83`, zie
  `src/lib/handle.ts`) — privacyvriendelijk, iedereen kan dezelfde
  weergavenaam kiezen, e-mailadres hoeft nooit gedeeld te worden.
  Vindbaarheid via e-mailadres is een losse, standaard-uit instelling
  (`User.searchableByEmail`).

## API- en servercode-conventies

- Route handlers: `NextRequest`/`NextResponse`, invoer gevalideerd met `zod`,
  fouten als `NextResponse.json({ error: "<Nederlandse boodschap>" }, { status })`.
- **Server is de enige bron van waarheid voor XP/scores/spelstatus** — de
  client stuurt nooit een bedrag of resultaat, de server berekent en
  valideert alles opnieuw (zie elke `complete*`-functie in `streak.ts`,
  `scrabbleGame.ts`, `gameServer.ts`). Concurrency-gevoelige tegoeden
  (hint-credits, groepsslots) gebruiken een atomic-`updateMany`-guard
  (`where: { ..., count: { gte/lt: n } }`) i.p.v. read-then-write.
  Competitie-XP loopt altijd via `awardCompetitionXp` (`src/lib/competitionXp.ts`)
  — de enige plek met anti-farming-regels (dagcap, afnemend rendement);
  algemene XP (`awardXp` in `xp.ts`) is ongelimiteerd en blijft dat.
- E-maillinks: gebruik `getBaseUrl(req)` (uit een route met een `NextRequest`)
  of `getAppUrl()` (async, overal elders — schedulers, socket-server) uit
  `src/lib/baseUrl.ts`. Beide zijn domeinonafhankelijk (geen hardcoded
  localhost/domein) — zie de harde regel hierboven voor de valkuil daarbij.
- E-mail is optioneel en admin-configureerbaar (`/adminbackend`, generieke
  SMTP); check altijd `isEmailConfigured()` voordat je een flow laat
  blokkeren op e-mail — zonder configuratie moet de app blijven werken.

## Codestijl

- Commentaar in het Nederlands, en legt **waarom** uit (niet-vanzelfsprekende
  aannames, edge cases, bewuste afwegingen) — nooit **wat** de code doet.
- Commitmessages: Nederlands, uitgebreid, leggen de reden van de wijziging
  uit (consistent zo door de hele gitgeschiedenis van dit project).
- Geen ORM-modelduplicatie in aparte typebestanden: types komen uit
  `@prisma/client` of worden lokaal in het bestand zelf gedefinieerd.

## Content & auteursrecht (relevant bij wijzigingen aan content/seeds)

- `prisma/content.ts` bevat **geen** letterlijke Boek van Mormon-tekst — dat
  is auteursrechtelijk beschermd. Alleen zelfgeschreven parafrases als demo.
  Echte content laden kan via `npm run db:import` (eigen, apart geregelde bron).
- De kindercursus-tekst/illustraties ("Verhalen uit het Boek van Mormon")
  worden met toestemming gebruikt — deel dit dus niet als losstaand
  bestand/export met een instantie die die toestemming niet apart heeft.

## Lokaal ontwikkelen

```bash
npm install
npm run db:migrate:deploy   # of db:push tijdens actieve schema-iteratie
npm run db:seed
npm run dev                 # tsx server.ts, vereist een lokale/bereikbare Postgres + Redis
```

Belangrijke env vars (zie `.env.example`): `DATABASE_URL`, `REDIS_URL`,
`SESSION_SECRET`, `ALLOW_INSECURE_COOKIES` (alleen voor http-LAN-testen),
`SEED_DEMO_USERS`, `APP_URL` (optioneel, anders auto-detectie uit het
verzoek), `PODCAST_FEED_URL` (optioneel). SMTP wordt niet via env
geconfigureerd maar via `/adminbackend` in de app zelf.

Vóór je een taak afrond: `npx tsc --noEmit`, handmatig testen (dev-server +
curl/Playwright), dan `rm -rf .next && npm run build` om er zeker van te
zijn dat de productiebuild ook slaagt.
