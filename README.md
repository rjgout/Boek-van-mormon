# Boek van Mormon

Op een speelse manier het Boek van Mormon lezen — in het Nederlands, Duolingo-stijl.

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
  scorebord (via Socket.io).

## Auteursrecht van de brontekst

De tekst van het Boek van Mormon is auteursrechtelijk beschermd door De Kerk
van Jezus Christus van de Heiligen der Laatste Dagen. `prisma/content.ts`
bevat daarom alleen een handvol **zelf geschreven parafrases** als
demo-inhoud — geen letterlijke overname van de officiële vertaling.

Zodra je toestemming hebt geregeld om de officiële tekst te gebruiken, kan
je je eigen content laden via:

```bash
npm run db:import -- ./mijn-boek-van-mormon.json
```

Zie de comments in `prisma/import.ts` voor het verwachte JSON-formaat.

## Aan de slag

```bash
npm install
cp .env.example .env      # pas SESSION_SECRET aan voor productie
npm run db:push           # database schema aanmaken
npm run db:seed           # demo-inhoud + demo-gebruikers (anna/bram/carla, wachtwoord: demo1234)
npm run dev                # start op http://localhost:3000
```

## Techstack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite
- Socket.io voor de live multiplayer-quiz (via een custom server, zie `server.ts`)

## Beperkingen van deze versie

- Live-spel-uitnodigingen komen alleen real-time binnen bij vrienden die op
  dat moment de site open hebben; anders deel je de speelcode handmatig.
- De wekelijkse competitie is een eenvoudige XP-ranglijst (geen
  divisies/promoveren zoals bij sommige apps).
- Voor productiegebruik: gebruik een sterke, geheime `SESSION_SECRET` en
  overweeg een zwaardere database (bv. Postgres) achter Prisma.
