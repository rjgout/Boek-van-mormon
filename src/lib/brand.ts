// Eén plek voor de merknaam, zodat die niet los door de hele codebase
// verspreid staat. Bewust niet gekoppeld aan één specifiek schriftwerk: de
// app is een algemene leeromgeving voor schriftstudie, het Boek van Mormon
// is daarbinnen de eerste cursus/contentbron (zie prisma/content.ts en
// src/lib/courses.ts), niet de identiteit van het hele product. "Geloof je
// dat ook?" is op dezelfde manier een aparte contentbron (de podcastcursus,
// zie prisma/podcastContent.ts) en dus ook geen productnaam.
export const APP_NAME = "Jehova";
export const APP_TAGLINE = "Schriftstudie op een speelse, motiverende manier.";
