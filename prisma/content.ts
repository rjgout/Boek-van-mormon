// LET OP — auteursrecht:
// De verzen hieronder zijn korte, zelf geschreven parafrases (geen letterlijke
// overname van de officiële, auteursrechtelijk beschermde NBV/kerkvertaling)
// die alleen dienen als demo-inhoud om de les- en oefeningflow te tonen.
// Vervang deze via een eigen import (zie prisma/seed.ts -> importFromJson)
// zodra je toestemming hebt geregeld om de officiële tekst te gebruiken.

// Begrijpend-lezen-oefeningen (zie ExerciseType.MULTIPLE_CHOICE/SEQUENCE):
// bewust handmatig geschreven, niet uit de verzen gegenereerd — dat vereist
// nu eenmaal daadwerkelijk begrip van wat er gebeurt, niet alleen de tekst.
export interface ComprehensionMultipleChoice {
  type: "MULTIPLE_CHOICE";
  verseRef: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface ComprehensionSequence {
  type: "SEQUENCE";
  verseRef: string;
  prompt: string;
  items: string[]; // in de juiste volgorde
}

export type ComprehensionExercise = ComprehensionMultipleChoice | ComprehensionSequence;

export interface SeedChapter {
  number: number;
  verses: string[];
  comprehension?: ComprehensionExercise[];
}

export interface SeedBook {
  slug: string;
  name: string;
  chapters: SeedChapter[];
}

export const seedBooks: SeedBook[] = [
  {
    slug: "1-nephi",
    name: "1 Nephi",
    chapters: [
      {
        number: 1,
        verses: [
          "Ik, Nephi, geboren uit goede ouders, kreeg onderwijs in de taal en de kennis van mijn vader.",
          "Nadat ik veel beproevingen in mijn leven had gezien, schreef ik dit verslag over wat ik heb gezien en gehoord.",
          "Ik schrijf een verslag naar de manier van mijn volk, in de taal van mijn vader.",
          "In het eerste jaar van de regering van de koning woonde mijn vader Lehi in Jeruzalem.",
          "Er kwamen in die tijd veel profeten die het volk waarschuwden dat de stad verwoest zou worden.",
          "Toen Lehi bad voor zijn volk, zag hij een groot licht en hoorde hij veel dingen die hem deden beven.",
          "Hij keerde terug naar zijn huis in Jeruzalem en wierp zich neer op zijn bed, overweldigd door de Geest.",
        ],
        comprehension: [
          {
            type: "MULTIPLE_CHOICE",
            verseRef: "1 Nephi 1",
            prompt: "Wat is de kernboodschap van dit hoofdstuk?",
            options: [
              "Nephi legt uit waarom hij dit verslag schrijft en vertelt over de roeping van zijn vader Lehi als profeet.",
              "Nephi beschrijft een oorlog tussen twee koninkrijken.",
              "Nephi vertelt over een groot feest in Jeruzalem.",
              "Nephi geeft een overzicht van de wetten van Mozes.",
            ],
            correctIndex: 0,
          },
          {
            type: "SEQUENCE",
            verseRef: "1 Nephi 1",
            prompt: "Zet deze gebeurtenissen in de juiste volgorde.",
            items: [
              "Nephi krijgt onderwijs van zijn vader.",
              "Profeten waarschuwen dat Jeruzalem verwoest zal worden.",
              "Lehi bidt en ziet een groot licht.",
              "Lehi keert terug naar huis, overweldigd door de Geest.",
            ],
          },
        ],
      },
      {
        number: 3,
        verses: [
          "Ik, Nephi, keerde terug naar Jeruzalem samen met mijn broers, zoals de Heer had geboden.",
          "Onze vader Lehi had ons opgedragen de koperen platen van Laban te gaan halen.",
          "Op de koperen platen stond een verslag van de wet en de geslachtsregisters van onze voorvaderen.",
          "Mijn broer Laman ging eerst naar Laban, maar Laban werd boos en joeg hem weg.",
          "Daarna probeerden wij ons familiebezit te ruilen voor de platen, maar Laban nam alles en joeg ons weg.",
          "Ik zei tegen mijn broers dat wij niet zouden terugkeren zonder de opdracht van de Heer te volbrengen.",
        ],
      },
    ],
  },
  {
    slug: "alma",
    name: "Alma",
    chapters: [
      {
        number: 5,
        verses: [
          "Alma sprak tot het volk in de stad Zarahemla en herinnerde hen aan de bevrijding van hun vaderen.",
          "Hij vroeg hun of zij een geestelijke wedergeboorte in hun hart hadden ervaren.",
          "Hij vroeg of zij het beeld van God in hun gelaat konden dragen zonder zich te schamen.",
          "Alma spoorde het volk aan om nederig te wandelen en goede vruchten voort te brengen.",
          "Hij waarschuwde dat een boom die geen goede vrucht draagt, wordt omgehakt en in het vuur geworpen.",
        ],
      },
      {
        number: 32,
        verses: [
          "Alma onderwees de armen onder het volk, die uit de synagogen waren verdreven vanwege hun eenvoudige kleding.",
          "Hij vertelde hun dat geloof niet hetzelfde is als volmaakte kennis van iets.",
          "Als je geen volmaakte kennis hebt, kun je toch geloven in de hoop op iets dat waar is.",
          "Alma vergeleek het woord met een zaadje dat geplant moet worden in het hart.",
          "Als het zaadje goed is en je het niet verwerpt, zal het beginnen te zwellen in je binnenste.",
          "Wanneer je merkt dat het zaadje groeit, is dat een teken dat het zaad goed was.",
        ],
      },
    ],
  },
];
