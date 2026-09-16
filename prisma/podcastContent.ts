// Handmatig samengestelde content bij een podcastaflevering van "Geloof je
// dat ook?" — gebaseerd op een door de eigenaar aangeleverd transcript.
// De vragen zijn eigen samenvattingen/parafrases van wat er besproken wordt,
// geen letterlijke overname van het transcript. De BOM_CONNECTION-vragen
// verwijzen naar de al bestaande zelf geschreven Alma 5-parafrase in
// prisma/content.ts (zie de auteursrechtnotitie daar).

export interface PodcastComprehensionMultipleChoice {
  type: "MULTIPLE_CHOICE";
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface PodcastComprehensionSequence {
  type: "SEQUENCE";
  prompt: string;
  items: string[]; // in de juiste volgorde
}

export interface PodcastComprehensionTrueFalse {
  type: "TRUE_FALSE";
  prompt: string;
  answer: boolean;
}

export type PodcastComprehensionExercise =
  | PodcastComprehensionMultipleChoice
  | PodcastComprehensionSequence
  | PodcastComprehensionTrueFalse;

export interface PodcastEpisodeSeed {
  number: number;
  title: string;
  summary: string;
  listenUrl?: string;
  content: PodcastComprehensionExercise[];
  bomConnection: PodcastComprehensionExercise[];
}

export const podcastEpisodes: PodcastEpisodeSeed[] = [
  {
    number: 127,
    title: "Geloofsartikel 9: doorlopende openbaring",
    summary:
      "Koos en Raphael bespreken het negende geloofsartikel — dat God nog vele grote en belangrijke dingen zal openbaren — en wat een openbaring nou eigenlijk herkenbaar maakt. Koos vertelt over het moment dat het Boek van Mormon voor hem 'waar' werd, bij Alma 5.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel staat in deze aflevering centraal?",
        options: [
          "Geloofsartikel 9 — dat God nog vele grote en belangrijke dingen zal openbaren",
          "Geloofsartikel 4 — geloof, bekering en doop",
          "Geloofsartikel 13 — eerlijk, trouw en kuis zijn",
          "Geloofsartikel 1 — geloof in God de eeuwige Vader",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar was Raphael deze zomer op vakantie?",
        options: ["Denemarken", "De Verenigde Staten", "Frankrijk", "Zweden"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos is enthousiast over de aangekondigde verandering in het vergaderschema van de kerk.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waardoor merk je volgens Raphael dat iets echt een openbaring van God is?",
        options: [
          "Door de invloed/het getuigenis van de Heilige Geest",
          "Doordat het in de krant staat",
          "Doordat iedereen het er direct mee eens is",
          "Doordat het een wonder is dat iedereen ziet",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos en Raphael praten over hun vakanties",
          "Ze bespreken geloofsartikel 9 over doorlopende openbaring",
          "Koos vertelt zijn persoonlijke ervaring met Alma 5",
          "Ze bespreken de aangekondigde verandering in het kerkschema",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt:
          "Koos noemt Alma 5 als het hoofdstuk waarbij het Boek van Mormon voor hem persoonlijk 'waar' werd. Welke vraag stelt Alma daar volgens onze samenvatting aan het volk?",
        options: [
          "Of zij een geestelijke wedergeboorte in hun hart hadden ervaren",
          "Of zij hun offergaven op tijd hadden betaald",
          "Of zij een zwaard hadden gesmeed voor de oorlog",
          "Of zij een droom hadden gehad die nacht",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke tweede, vergelijkbare vraag stelt Alma volgens Alma 5?",
        options: [
          "Of zij het beeld van God in hun gelaat konden dragen zonder zich te schamen",
          "Of zij bereid waren te vasten voor een week",
          "Of zij hun huizen wilden delen met vreemdelingen",
          "Of zij de koperen platen hadden gelezen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 5 wordt een boom die geen goede vrucht draagt, gespaard voor later.",
        answer: false,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Alma 5 in de juiste volgorde.",
        items: [
          "Alma spreekt tot het volk in de stad Zarahemla",
          "Hij vraagt of zij een geestelijke wedergeboorte hebben ervaren",
          "Hij vraagt of zij Gods beeld in hun gelaat dragen zonder schaamte",
          "Hij waarschuwt dat een vruchteloze boom wordt omgehakt",
        ],
      },
    ],
  },
  {
    // Titel/samenvatting zijn hier bewust een kale placeholder: de
    // podcastfeed-sync (src/lib/podcastFeed.ts, draait vlak na deze import
    // in src/lib/seed.ts) overschrijft ze toch met de echte titel/omschrijving
    // uit de RSS-feed — die is leidend qua benaming, niet dit bestand.
    number: 128,
    title: "Aflevering 128",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar praten Koos en Raphael in deze aflevering vooral over?",
        options: [
          "De halfjaarlijkse algemene conferentie van de kerk",
          "Het vertalen van het Boek van Mormon",
          "De geschiedenis van de zending in Utah",
          "Het bouwen van een nieuw kerkgebouw",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoeveel sessies telt de algemene conferentie op dit moment?",
        options: ["Vier", "Vijf", "Zes", "Acht"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Vroeger was er ook nog een aparte sessie op zaterdagavond, die inmiddels is afgeschaft.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat kreeg Raphael ooit als 'inspiratiebron' toegewezen voor een eigen toespraak in zijn wijk?",
        options: [
          "Een toespraak uit een eerdere algemene conferentie",
          "Een hoofdstuk uit het Boek van Mormon",
          "Een lied uit het kerkliedboek",
          "Een persoonlijk verhaal van de bisschop",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze manieren waarop Koos en Raphael vroeger de conferentie volgden in de juiste (chronologische) volgorde.",
        items: [
          "Uitzending via de radio",
          "Videoband (VHS) die met de post kwam",
          "Satellietschotel bij de wijk",
          "Livestream via internet",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke drie voorwaarden noemt Moroni in Moroni 10 om een antwoord van God te krijgen of iets waar is?",
        options: [
          "Een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Vasten, bidden en een offergave brengen",
          "Het boek driemaal lezen en het navertellen aan een vriend",
          "Een droom hebben en die opschrijven",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Door welke macht zegt Moroni dat die waarheid aan je geopenbaard zal worden?",
        options: [
          "Door de macht van de Heilige Geest",
          "Door een engel die verschijnt",
          "Door een droom die je 's nachts krijgt",
          "Door een stem die je hoort in de tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 10 kun je door de macht van de Heilige Geest de waarheid van alle dingen kennen, niet alleen van het Boek van Mormon.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Moroni's aansporing in Moroni 10 in de juiste volgorde.",
        items: [
          "Lees de kroniek en overweeg in je hart hoe barmhartig God is geweest",
          "Vraag God in de naam van Christus of deze dingen waar zijn",
          "Vraag met een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Ontvang de waarheid geopenbaard door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    // Titel/samenvatting: kale placeholder, zie de toelichting bij aflevering
    // 128 hierboven — de podcastfeed-sync overschrijft deze toch.
    number: 126,
    title: "Aflevering 126",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welke stichting werken gasten Lisette en Sheila in deze aflevering vooral samen?",
        options: ["Stichting Babyspullen", "De Voedselbank", "Jantje Beton", "Het Rode Kruis"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat doet Stichting Babyspullen precies?",
        options: [
          "Ze maken babystartpakketten voor aanstaande moeders die in armoede leven",
          "Ze bouwen speeltuinen voor arme wijken",
          "Ze geven gratis kinderopvang aan alleenstaande ouders",
          "Ze verzorgen zwangerschapscursussen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Sheila vertelt dat de kerk een deel van het gedoneerde geld inhoudt als vergoeding voor de organisatie.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoeveel baby's worden er volgens Lisette dagelijks in armoede geboren in Nederland?",
        options: ["5", "15", "35", "70"],
        correctIndex: 2,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Lisette en Sheila stellen zichzelf voor",
          "Ze vertellen over het Strength of Women-evenement van 2024",
          "Ze leggen de landelijke inzamelactie voor Stichting Babyspullen uit",
          "Koos vertelt over de wet van de tiende en het beginsel van vasten",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt koning Benjamin in Mosiah 4 dat je moet doen als een bedelaar je om hulp vraagt?",
        options: [
          "Hem van je overvloed geven, en hem niet tevergeefs laten smeken",
          "Hem wegsturen, want zijn armoede is zijn eigen schuld",
          "Hem alleen helpen als hij eerst laat zien dat hij zich bekeerd heeft",
          "Hem doorverwijzen naar de overheid",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke reden geeft koning Benjamin waarom niemand het recht heeft om te oordelen wie hulp \"verdient\"?",
        options: [
          "Omdat wij allemaal zelf bedelaars zijn, afhankelijk van God voor alles wat we hebben",
          "Omdat de wet dat verbiedt",
          "Omdat armoede altijd door onrecht komt",
          "Omdat rijkdom een teken van Gods ongenoegen is",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Mosiah 4 blijft iemand die een bedelaar afwijst met de gedachte \"dat is zijn eigen schuld\" zonder gevolgen, zolang hij zelf niets te verwijten valt.",
        answer: false,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van koning Benjamin in Mosiah 4 in de juiste volgorde.",
        items: [
          "Hij roept op om de noodlijdende te helpen met wat je zelf bezit",
          "Hij waarschuwt tegen de gedachte dat armoede altijd iemands eigen schuld is",
          "Hij legt uit dat we allen bedelaars zijn, afhankelijk van God voor alles",
          "Hij zegt dat je naar vermogen moet geven, in wijsheid en ordelijkheid",
        ],
      },
    ],
  },
  {
    number: 125,
    title: "Aflevering 125",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk onderwerp staat in deze aflevering centraal, als vervolg op een eerdere aflevering?",
        options: [
          "De verwachtingen die Hemelse Vader van ons heeft, en onze verwachtingen van Hem",
          "De geschiedenis van het eerste visioen",
          "Het kiezen van een zendingsgebied",
          "Het opvoeden van kinderen zonder geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vindt het woord \"verwachting\" eigenlijk niet helemaal passend voor wat hij voor zijn eigen kinderen voelt — hij noemt het liever \"hoop\".",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarin kun je volgens Koos en Raphael persoonlijke aanwijzingen over Gods verwachtingen van jou terugvinden?",
        options: ["Een patriarchale zegen", "Een droom", "Een horoscoop", "Een priesterschapsinterview"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat vertelt Raphael over zijn zus, na haar ernstige auto-ongeluk?",
        options: [
          "Ze kreeg een zegen, ontwaakte uit coma, maar is niet meer helemaal de oude geworden",
          "Ze overleed enkele dagen na het ongeluk",
          "Ze herstelde volledig zonder enige blijvende gevolgen",
          "Ze weigerde een priesterschapszegen te ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken wat een patriarchale zegen zegt over verwachtingen",
          "Koos legt uit dat hij zijn kinderen liever geluk gunt dan verwachtingen oplegt",
          "Raphael vertelt over de zegen die zijn zus kreeg na haar ongeluk",
          "Ze concluderen dat sommige antwoorden pas later in het leven komen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarmee vergelijkt Alma het geloof in Alma 32?",
        options: [
          "Met een zaadje dat je in je hart moet planten en laten groeien",
          "Met een steen die nooit verandert",
          "Met een rivier die altijd dezelfde kant op stroomt",
          "Met een lamp die je nooit hoeft bij te vullen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 32 is geloof hetzelfde als een volmaakte kennis van iets hebben.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat moet je volgens Alma doen om te ontdekken of het woord goed is?",
        options: [
          "Het woord in je hart planten en de proef op de som nemen",
          "Wachten tot iemand anders het je vertelt",
          "Het bewijzen met wetenschappelijk onderzoek",
          "Het pas geloven nadat je een wonder hebt gezien",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Alma's gelijkenis van het zaadje in Alma 32 in de juiste volgorde.",
        items: [
          "Je plant het zaadje/woord en geeft het geen ongeloof",
          "Het zaadje begint te zwellen en te ontspruiten",
          "Je verzorgt de boom met ijver, geduld en geloof",
          "Uiteindelijk pluk je de vrucht, die uiterst kostbaar is",
        ],
      },
    ],
  },
  {
    number: 124,
    title: "Aflevering 124",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: ["Geloofsartikel 8", "Geloofsartikel 4", "Geloofsartikel 9", "Geloofsartikel 13"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt geloofsartikel 8 over de Bijbel en het Boek van Mormon?",
        options: [
          "De Bijbel is het woord van God voor zover juist vertaald; het Boek van Mormon is het woord van God",
          "Beide boeken zijn woordelijk letterlijk gedicteerd door engelen",
          "Alleen het Boek van Mormon is het woord van God",
          "Beide boeken zijn menselijke verzinsels zonder goddelijke inspiratie",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat Nephi zijn kroniek soms wel 35 jaar na de gebeurtenissen zelf opschreef, door inspiratie van de Geest.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom staat er bij de Bijbel wél \"voor zover juist vertaald\", maar niet bij het Boek van Mormon?",
        options: [
          "Omdat het Boek van Mormon rechtstreeks door inspiratie vertaald is, terwijl de Bijbel eeuwenlang is overgeschreven en herzien",
          "Omdat de Bijbel helemaal niet vertaald hoeft te worden",
          "Omdat het Boek van Mormon geen vertaling is, maar oorspronkelijk in het Nederlands geschreven is",
          "Omdat er geen verschil is tussen beide boeken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 8 voor en bespreken wat \"het woord van God\" betekent",
          "Ze bespreken hoe Nephi door inspiratie kon opschrijven wat 35 jaar eerder gebeurde",
          "Ze bespreken de verloren pagina's van de vertaling van het Boek van Mormon",
          "Ze bespreken waarom bij de Bijbel \"voor zover juist vertaald\" staat en bij het Boek van Mormon niet",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 1 Nephi 11 legt een engel aan Nephi uit waar de ijzeren roede uit Lehi's droom voor staat. Waarvoor staat die?",
        options: [
          "Het woord van God",
          "Het priesterschap",
          "De liefde van God",
          "De tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar leidt de ijzeren roede volgens 1 Nephi 11 naartoe?",
        options: [
          "Naar de boom des levens",
          "Naar het grote en ruime gebouw",
          "Naar de rivier van vuil water",
          "Naar het land van belofte",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 1 Nephi 11 zijn de wateren waar de roede naartoe leidt een zinnebeeld van de liefde van God.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Lehi's droom en de uitleg ervan in 1 Nephi 11 in de juiste volgorde.",
        items: [
          "Een engel toont Nephi een visioen dat lijkt op de droom van zijn vader",
          "Hij ziet de Zoon van God onder de mensen komen",
          "De engel legt uit dat de ijzeren roede het woord van God is",
          "De roede voert naar de boom des levens, bij de wateren die Gods liefde voorstellen",
        ],
      },
    ],
  },
  {
    number: 123,
    title: "Aflevering 123",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk onderwerp bespreken Koos en Raphael in deze aflevering, te beginnen met herinneringen aan Sinterklaas?",
        options: [
          "Verwachtingen, en wat er gebeurt als die niet uitkomen",
          "Het vieren van kerstfeest binnen de kerk",
          "Het geven van cadeaus als liefdadigheid",
          "De geschiedenis van Nederlandse feestdagen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij ooit zijn baan kwijtraakte omdat een teamlid een belangrijke deadline niet haalde.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er toen Koos lage verwachtingen had van een stagiair?",
        options: [
          "De stagiair overtrof zijn verwachtingen, wat Koos blij verraste",
          "De stagiair voldeed precies aan de lage verwachtingen",
          "De stagiair stelde teleur, zoals verwacht",
          "Koos had helemaal geen stagiair die periode",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos de relatie tussen de hoogte van een verwachting en teleurstelling?",
        options: [
          "Hoe hoger de verwachting, hoe zwaarder de teleurstelling als die niet uitkomt",
          "Verwachtingen hebben geen enkel verband met teleurstelling",
          "Lage verwachtingen leiden juist tot de grootste teleurstelling",
          "Teleurstelling hangt alleen af van geluk, niet van verwachtingen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze herinneren zich hun kinderlijke verwachtingen rond Sinterklaas",
          "Ze bespreken verwachtingen op het werk en de gevolgen als die niet worden waargemaakt",
          "Koos vertelt over een stagiair die zijn lage verwachtingen overtrof",
          "Ze concluderen dat je je verwachtingen kunt bijstellen om teleurstelling te beperken",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos noemt dat teleurstelling hoort bij het \"tegenstellingenpatroon\" van het leven. In welk hoofdstuk van het Boek van Mormon legt Lehi dit principe uit aan zijn zoon Jakob?",
        options: ["2 Nephi 2", "Alma 32", "Mosiah 4", "Moroni 10"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Lehi in 2 Nephi 2 dat er móét zijn, wil er ooit gerechtigheid of goddeloosheid, heiligheid of ellende kunnen bestaan?",
        options: [
          "Een tegenstelling in alle dingen",
          "Een tempel op aarde",
          "Een profeet die leeft",
          "Een geschreven wet",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Lehi in 2 Nephi 2 kon de mens niet zelfstandig handelen (agency uitoefenen), tenzij hij door het één of het ander verlokt werd.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen van Lehi's redenering in 2 Nephi 2 in de juiste volgorde.",
        items: [
          "Hij legt uit dat er een tegenstelling in alle dingen moet zijn",
          "Hij redeneert dat zonder wet er geen zonde en geen gerechtigheid kan bestaan",
          "Hij legt uit dat God de mens zelfstandig liet handelen",
          "Hij zegt dat de mens niet kon handelen zonder door iets verlokt te worden",
        ],
      },
    ],
  },
  {
    number: 122,
    title: "Aflevering 122",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke diepe theologische vraag staat in deze aflevering centraal?",
        options: [
          "Wat maakt een God eigenlijk een God?",
          "Waarom bestaat er lijden in de wereld?",
          "Hoe oud is de aarde volgens de Schriften?",
          "Wie schreef het boek Genesis?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zeggen Koos en Raphael over hoe Jezus Christus en de Heilige Geest hun status als God hebben gekregen?",
        options: [
          "Ze zijn door Hemelse Vader benoemd/geroepen tot hun taak",
          "Ze zijn dat altijd al geweest, net als Hemelse Vader",
          "Ze werden God door menselijke aanbidding",
          "Niemand van hen is werkelijk een God",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos en Raphael zou je, als je de \"elementen kunt beheersen\" zoals in hun gedachte-experiment, daarmee automatisch een God worden.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom is Satan volgens Koos geen echte God, ook al heeft hij zichzelf zo uitgeroepen?",
        options: [
          "Omdat hij zijn macht ontleent aan het kwaad, en niet door God benoemd is",
          "Omdat hij geen kennis heeft",
          "Omdat hij geen naam heeft",
          "Omdat hij nooit heeft bestaan",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken het verschil tussen Hemelse Vader, Jezus Christus en de Heilige Geest",
          "Ze filosoferen over een gedachte-experiment: het beheersen van de elementen",
          "Ze bespreken waarom Satan zichzelf god noemt, maar het niet is",
          "Ze bespreken het idee dat mensen ooit zelf een God kunnen worden",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 12 (de leer op de tempel) zegt Christus dat Hij wil dat wij net zo worden als wie?",
        options: [
          "Volmaakt, zoals Hij en de Vader in de hemel volmaakt zijn",
          "Volmaakt, zoals de engelen",
          "Volmaakt, zoals de profeten van weleer",
          "Christus zegt dat volmaaktheid onmogelijk is voor mensen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 12 zijn de oude dingen (de wet van Mozes) weggedaan en alle dingen nieuw geworden door Christus.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens deze tekst in 3 Nephi 12 het gevolg van kinderen van de Vader in de hemel worden?",
        options: [
          "Je wordt geroepen om net zo volmaakt te worden als Hij",
          "Je hoeft de geboden niet meer te houden",
          "Je krijgt automatisch alle antwoorden op je vragen",
          "Je wordt vrijgesteld van beproevingen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze uitspraken van Christus in 3 Nephi 12 in de juiste volgorde.",
        items: [
          "Hij roept op om kinderen van de Vader in de hemel te zijn",
          "Hij zegt dat oude dingen (de wet van Mozes) zijn weggedaan",
          "Hij zegt dat alle dingen nieuw zijn geworden in Hem",
          "Hij roept op om volmaakt te zijn, zoals Hij en de Vader volmaakt zijn",
        ],
      },
    ],
  },
  {
    number: 121,
    title: "Aflevering 121",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: ["Geloofsartikel 7 (de gaven van de Geest)", "Geloofsartikel 3", "Geloofsartikel 10", "Geloofsartikel 12"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke drie aparte gaven noemen ze naast elkaar: profetie, openbaring en...?",
        options: ["Visioenen", "Genezing", "Talen", "Vertaling"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Raphael en Koos krijgt iedereen precies dezelfde gaven van God toebedeeld.",
        answer: false,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarvoor wordt gewijde olijfolie gebruikt, zoals besproken bij de gave van gezondmaking?",
        options: [
          "Om iemand te zalven bij een zegen voor de zieken",
          "Om de doopvont te reinigen",
          "Om kaarsen te maken voor de tempel",
          "Om brood te bakken voor het avondmaal",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 7 voor en bespreken wat een \"gave\" precies is",
          "Ze bespreken de gave van talen en zendelingen die snel een taal leren",
          "Ze bespreken profetie, openbaring en visioenen als aparte gaven",
          "Ze bespreken de gave van gezondmaking en het zalven met gewijde olie",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Raphael noemt de droom van Lehi en Nephi over de boom des levens als voorbeeld van een visioen. In welk hoofdstuk begint deze droom?",
        options: ["1 Nephi 8", "Alma 32", "Mosiah 4", "3 Nephi 12"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe smaakte de vrucht van de boom volgens Lehi's beschrijving in 1 Nephi 8?",
        options: [
          "Zoeter dan alles wat hij ooit had geproefd",
          "Bitter, maar toch waardevol",
          "Zout, als water uit de zee",
          "Smaakloos, maar met een aangename geur",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "In 1 Nephi 8 raken sommige mensen in een mist van duisternis hun weg kwijt en dwalen ze af van het pad naar de boom.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Lehi's droom in 1 Nephi 8 in de juiste volgorde.",
        items: [
          "Lehi ziet een boom met begerenswaardige vrucht",
          "Hij proeft de vrucht en verlangt dat zijn gezin er ook van neemt",
          "Er komt een mist van duisternis op, waardoor mensen de weg kwijtraken",
          "Sommigen grijpen de ijzeren roede vast en klampen zich eraan vast op weg naar de boom",
        ],
      },
    ],
  },
  {
    number: 120,
    title: "Aflevering 120",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het hoofdonderwerp van deze aflevering?",
        options: [
          "Wat het woord \"heilige\" precies betekent",
          "De geschiedenis van de eerste apostelen",
          "Het vieren van kerkelijke feestdagen",
          "De organisatie van de tempel",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos legt uit dat het woord \"heilig\" (Hebreeuws: kadosh) letterlijk betekent...",
        options: ["Toewijden / apart zetten", "Volmaakt zijn", "Overleden zijn", "Gedoopt zijn"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "In de katholieke traditie worden mensen meestal pas na hun overlijden heilig verklaard, terwijl het Nieuwe Testament levende gelovigen al \"heiligen\" noemt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat wordt bedoeld met \"de Sabbatdag heiligen\"?",
        options: [
          "De dag apart zetten en toewijden aan God, in plaats van aan alledaagse bezigheden",
          "Nooit meer buiten mogen komen op zondag",
          "Een speciale maaltijd bereiden voor de kerkleiders",
          "Elke zondag een nieuwe heilige aanwijzen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Koos vertelt hoe hij het woord \"heilige\" kende vanuit zijn katholieke jeugd",
          "Raphael legt de Hebreeuwse betekenis van \"heilig\" (kadosh) uit",
          "Ze bespreken de naam \"De Kerk van Jezus Christus van de Heiligen der Laatste Dagen\"",
          "Koos vertelt over zijn eigen proces van heiliging, met een voorbeeld uit het verkeer",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Mosiah 3 zegt koning Benjamin dat de natuurlijke mens een vijand van God is, tenzij hij zich overgeeft aan de Heilige Geest en...",
        options: [
          "Een heilige wordt door de verzoening van Christus",
          "Zich terugtrekt uit de maatschappij",
          "Zich aan strenge vastenwetten houdt",
          "Alle bezittingen wegdoet",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe wordt iemand die de natuurlijke mens aflegt volgens Mosiah 3:19 als een kind — welke eigenschappen worden genoemd?",
        options: [
          "Onderworpen, zachtmoedig, ootmoedig, geduldig, vol liefde",
          "Streng, veeleisend, ongeduldig",
          "Onafhankelijk en op zichzelf",
          "Rijk en succesvol",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens koning Benjamin is de natuurlijke mens sinds de val van Adam een vijand van God geweest.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Mosiah 3:19 in de juiste volgorde.",
        items: [
          "De natuurlijke mens is van nature een vijand van God",
          "Hij geeft zich over aan de ingevingen van de Heilige Geest",
          "Hij legt de natuurlijke mens af door de verzoening van Christus",
          "Hij wordt als een kind: onderworpen, zachtmoedig en vol liefde",
        ],
      },
    ],
  },
];
