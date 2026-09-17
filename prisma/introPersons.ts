// Personen voor de introductiecursus (zie prisma/introContent.ts) en de
// "tik op een naam"-kaartjes daarin. Beschrijvingen zijn bewust feitelijk/
// verhalend (wie, familie, wat ze deden) en geen theologisch commentaar —
// getoetst aan de echte tekst (zie bv. 1 Nephi 1:4 en 2:2-5 voor Lehi's
// gezin) via een kort python3/node-scriptje, net als bij de podcast-
// Boek van Mormon-koppelingen. fatherSlug verwijst naar een andere entry
// hieronder (of null); prisma/importIntro.ts lost dit op naar Person.fatherId.

export interface IntroPersonSeed {
  slug: string;
  name: string;
  description: string;
  fatherSlug?: string;
}

export const introPersons: IntroPersonSeed[] = [
  {
    slug: "lehi",
    name: "Lehi",
    description:
      "Woonde met zijn gezin in Jeruzalem. Kreeg de opdracht om, vlak voordat de stad zou worden verwoest, met " +
      "zijn familie de wildernis in te trekken. Vader van Laman, Lemuel, Sam, Nephi, en later ook Jakob en Jozef.",
  },
  {
    slug: "sariah",
    name: "Sariah",
    description: "De vrouw van Lehi en moeder van hun kinderen. Trok samen met het gezin de wildernis in.",
  },
  {
    slug: "laman",
    name: "Laman",
    description: "De oudste zoon van Lehi en Sariah.",
    fatherSlug: "lehi",
  },
  {
    slug: "lemuel",
    name: "Lemuel",
    description: "Zoon van Lehi en Sariah, jonger dan Laman.",
    fatherSlug: "lehi",
  },
  {
    slug: "sam",
    name: "Sam",
    description: "Zoon van Lehi en Sariah.",
    fatherSlug: "lehi",
  },
  {
    slug: "nephi",
    name: "Nephi",
    description:
      "Jongste van de vier oudste zonen van Lehi en Sariah. Schrijft zelf het eerste boek van het Boek van " +
      "Mormon, en vertelt daarin het verhaal van zijn familie.",
    fatherSlug: "lehi",
  },
  {
    slug: "mormon",
    name: "Mormon",
    description:
      "Bracht, veel later in de geschiedenis, de verslagen van eerdere schrijvers samen en maakte er een " +
      "samenvatting van — het grootste deel van het Boek van Mormon is zijn werk. Vader van Moroni.",
  },
  {
    slug: "moroni",
    name: "Moroni",
    description:
      "De zoon van Mormon. Maakte het boek af nadat zijn vader was overleden, en voegde er zelf nog een deel aan toe.",
    fatherSlug: "mormon",
  },
  {
    slug: "alma",
    name: "Alma",
    description:
      "Werd door zijn vader (die ook al Alma heette) gewijd tot hogepriester, en predikte daarna door het hele " +
      "land — te beginnen in de stad Zarahemla. Leeft veel later dan Lehi's gezin.",
  },
  {
    slug: "samuel-de-lamaniet",
    name: "Samuel de Lamaniet",
    description:
      "Een Lamaniet die naar de stad Zarahemla kwam om tot de Nephieten te prediken. Toen ze hem niet binnen " +
      "wilden laten, klom hij op de stadsmuur en riep zijn boodschap vandaar.",
  },
];
