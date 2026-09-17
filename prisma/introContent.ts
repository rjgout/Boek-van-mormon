// Content voor de introductiecursus "Ontdek het Boek van Mormon" — zie
// prisma/importIntro.ts voor hoe dit wordt ingeladen, en CLAUDE.md voor de
// afspraak dat aanpassen hier + "content opnieuw laden" de manier is om de
// tekst te wijzigen (net als prisma/podcastContent.ts/kidsManifest.json).
//
// Elke les is een reeks content-blokken (uitleg/interactie, zie IntroBlock
// hieronder) gevolgd door een paar gegradeerde oefeningen (IntroExerciseSeed,
// hergebruikt dezelfde ExerciseType's als de rest van de app — geen nieuw
// oefeningtype nodig). Blokken die naar echte tekst/personen/boeken
// verwijzen (scripture/personTree/bookList) doen dat altijd via een
// slug/nummer-verwijzing naar bestaande Verse/Person/Book-rijen, nooit met
// zelf gekopieerde tekst — zie de toelichting bij IntroLesson in
// schema.prisma.

export type IntroBlock =
  | { type: "text"; body: string }
  // Ongegradeerd, puur voor betrokkenheid — wordt nergens opgeslagen.
  | { type: "poll"; question: string; options: string[] }
  // Ongegradeerd open nadenkmoment, geen vast "goed" antwoord.
  | { type: "reflection"; question: string; prompts?: string[] }
  // Tijdlijn/route-overzicht (uitleg, niet gegradeerd — de gegradeerde
  // volgorde-check zit apart in exercises, als SEQUENCE-oefening).
  | { type: "steps"; title?: string; steps: { label: string; description?: string }[] }
  // Familie-/personenkaart — leest de echte Person-tabel (prisma/introPersons.ts).
  | { type: "personTree"; intro?: string; personSlugs: string[] }
  // "Boekenkast" — leest de echte Book-tabel (bookSlug moet een bestaande
  // Book.slug zijn, zie prisma/bomContent.json).
  | { type: "bookList"; intro?: string; bookSlugs: string[] }
  // Toont een echt fragment — leest live uit de Verse-tabel, nooit
  // gekopieerde tekst hier in dit bestand.
  | { type: "scripture"; bookSlug: string; chapterNumber: number; verseNumbers?: number[]; label?: string }
  // Link naar iets echts binnen de app (lezer, cursusoverzicht, personen).
  | { type: "readMore"; label: string; href: string }
  // Vast eindscherm met de 3 keuzes — alleen gebruikt in de laatste les.
  | { type: "finalChoices" };

export interface IntroExerciseOptionSeed {
  label: string;
  isCorrect: boolean;
}

export interface IntroExerciseSeed {
  type: "FILL_BLANK" | "WORD_BANK" | "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SEQUENCE";
  prompt: string;
  answers: string[];
  wordBank?: string[];
  options?: IntroExerciseOptionSeed[];
}

export interface IntroLessonSeed {
  number: number;
  slug: string;
  title: string;
  summary: string;
  blocks: IntroBlock[];
  exercises: IntroExerciseSeed[];
}

export const introLessons: IntroLessonSeed[] = [
  {
    number: 1,
    slug: "wat-is-het-boek-van-mormon",
    title: "Wat is het Boek van Mormon?",
    summary: "Een eerste kennismaking — geen voorkennis nodig.",
    blocks: [
      {
        type: "poll",
        question: "Heb je het Boek van Mormon al eens gelezen?",
        options: ["Nog nooit", "Een paar stukjes", "Ik heb het al eens gelezen", "Ik weet het eigenlijk niet meer"],
      },
      {
        type: "text",
        body:
          "Welkom! Je hoeft helemaal niets te weten om deze cursus te beginnen — dat is precies waar hij voor is. " +
          "In ongeveer 12 korte lessen ontdek je wat het Boek van Mormon is, wie erin voorkomen, en waar het over gaat.",
      },
      {
        type: "text",
        body:
          "Het Boek van Mormon is een boek met geschiedenissen en geloofsverhalen, opgeschreven door verschillende " +
          "mensen over een periode van ruim duizend jaar. Het heet zo omdat het grootste deel is samengevat en " +
          "bewerkt door iemand die Mormon heette — hij bracht de verslagen van eerdere schrijvers samen tot één boek.",
      },
      {
        type: "personTree",
        intro: "Twee namen kom je in deze cursus vaak tegen — al spelen ze pas heel laat in het verhaal een rol:",
        personSlugs: ["mormon", "moroni"],
      },
      {
        type: "text",
        body:
          "Moroni was de zoon van Mormon. Hij maakte het boek af nadat zijn vader was overleden, en voegde er zelf " +
          "ook nog een deel aan toe.",
      },
      {
        type: "text",
        body:
          "Volgens de kerk is het Boek van Mormon bedoeld als een tweede getuige naast de Bijbel — beide boeken " +
          "vertellen, ieder op hun eigen plek in de geschiedenis, over Jezus Christus.",
      },
    ],
    exercises: [
      {
        type: "FILL_BLANK",
        prompt: "Het Boek van Mormon is volgens de kerk een tweede getuige van ______.",
        answers: ["jezus christus"],
        options: [
          { label: "Jezus Christus", isCorrect: true },
          { label: "Mormon", isCorrect: false },
          { label: "de profeten", isCorrect: false },
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie bracht de verslagen van eerdere schrijvers samen tot het Boek van Mormon?",
        answers: ["Mormon"],
        options: [
          { label: "Mormon", isCorrect: true },
          { label: "Moroni", isCorrect: false },
          { label: "Nephi", isCorrect: false },
        ],
      },
      {
        type: "TRUE_FALSE",
        prompt: "Moroni was de vader van Mormon.",
        answers: ["false"],
      },
    ],
  },
  {
    number: 2,
    slug: "het-verhaal-in-5-minuten",
    title: "Het verhaal in 5 minuten",
    summary: "Het grote plaatje, zonder details.",
    blocks: [
      {
        type: "text",
        body:
          "Voordat we in details duiken, eerst het hele verhaal in vogelvlucht — zodat je straks elk stukje ergens " +
          "kan plaatsen.",
      },
      {
        type: "steps",
        title: "Het grote verhaal",
        steps: [
          { label: "Jeruzalem", description: "Een familie krijgt de opdracht te vertrekken." },
          { label: "Wildernis", description: "Jarenlang reizen door de woestijn." },
          { label: "Nieuw land", description: "Met de boot naar een onbekend werelddeel." },
          { label: "Generaties", description: "Nakomelingen groeien uit tot volken." },
          { label: "Conflicten", description: "Perioden van vrede én van oorlog." },
          { label: "Jezus Christus", description: "Hij verschijnt persoonlijk aan het volk." },
          { label: "Verval", description: "Uiteindelijk verdwijnt de vrede weer." },
          { label: "Mormon en Moroni", description: "Zij schrijven de laatste bladzijden en verbergen het boek." },
        ],
      },
      {
        type: "text",
        body:
          "Dat is het. Je hoeft dit rijtje nog niet uit je hoofd te kennen — in de volgende lessen komt elk stukje " +
          "apart nog een keer terug.",
      },
    ],
    exercises: [
      {
        type: "SEQUENCE",
        prompt: "Zet de gebeurtenissen in de juiste volgorde.",
        answers: ["Jeruzalem", "Wildernis", "Nieuw land", "Jezus Christus verschijnt", "Mormon en Moroni"],
        wordBank: ["Jeruzalem", "Wildernis", "Nieuw land", "Jezus Christus verschijnt", "Mormon en Moroni"],
      },
    ],
  },
  {
    number: 3,
    slug: "wie-is-wie",
    title: "Wie is wie?",
    summary: "Maak kennis met de familie van Lehi.",
    blocks: [
      {
        type: "text",
        body: "Het verhaal begint bij één gezin: Lehi en Sariah, en hun kinderen.",
      },
      {
        type: "personTree",
        intro: "De familie van Lehi:",
        personSlugs: ["lehi", "sariah", "laman", "lemuel", "sam", "nephi"],
      },
      {
        type: "text",
        body:
          "Later in het verhaal komen er nog twee zonen bij: Jakob en Jozef. En helemaal aan het einde van het " +
          "boek — meer dan 900 jaar later — spelen Mormon en Moroni hun rol.",
      },
      {
        type: "reflection",
        question: "Vier broers, vier verschillende karakters. Wat verwacht je dat er gebeurt als ze het niet eens zijn?",
      },
    ],
    exercises: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie is Nephi van Lehi?",
        answers: ["Zijn zoon"],
        options: [
          { label: "Zijn zoon", isCorrect: true },
          { label: "Zijn broer", isCorrect: false },
          { label: "Zijn vader", isCorrect: false },
        ],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wie is Sariah?",
        answers: ["Lehi's vrouw"],
        options: [
          { label: "Lehi's vrouw", isCorrect: true },
          { label: "Lehi's dochter", isCorrect: false },
          { label: "Nephi's vrouw", isCorrect: false },
        ],
      },
      {
        type: "TRUE_FALSE",
        prompt: "Laman en Lemuel zijn de broers van Nephi.",
        answers: ["true"],
      },
    ],
  },
  {
    number: 4,
    slug: "van-jeruzalem-naar-een-nieuw-land",
    title: "Van Jeruzalem naar een nieuw land",
    summary: "Het vertrek van Lehi's familie.",
    blocks: [
      {
        type: "text",
        body:
          "Lehi kreeg de waarschuwing dat Jeruzalem zou vallen, en de opdracht om met zijn gezin de stad te " +
          "verlaten — vóórdat dat gebeurde.",
      },
      {
        type: "steps",
        title: "De route",
        steps: [
          { label: "Jeruzalem", description: "Lehi waarschuwt de stad, en vertrekt dan zelf." },
          { label: "Wildernis", description: "Jarenlang op reis, met tussenstops om voedsel en platen te halen." },
          { label: "Zee", description: "Nephi bouwt, met hulp van God, een schip." },
          { label: "Nieuw land", description: "Na een lange overtocht bereiken ze een nieuw werelddeel." },
        ],
      },
      {
        type: "text",
        body:
          "Onderweg haalden Nephi en zijn broers ook de koperen platen op — kostbare platen met daarop de " +
          "geschiedenis en geloofsleer van hun volk tot dan toe.",
      },
      {
        type: "readMore",
        label: "Lees zelf hoe dit verhaal begint",
        href: "/courses/per-boek",
      },
    ],
    exercises: [
      {
        type: "SEQUENCE",
        prompt: "Zet de reis in de juiste volgorde.",
        answers: ["Jeruzalem", "Wildernis", "Zee", "Nieuw land"],
        wordBank: ["Jeruzalem", "Wildernis", "Zee", "Nieuw land"],
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat haalden Nephi en zijn broers onderweg op?",
        answers: ["De koperen platen"],
        options: [
          { label: "De koperen platen", isCorrect: true },
          { label: "Een schip", isCorrect: false },
          { label: "Een leger", isCorrect: false },
        ],
      },
    ],
  },
];
