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
  {
    number: 119,
    title: "Aflevering 119",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke centrale vraag stellen Koos en Raphael zichzelf in deze aflevering?",
        options: [
          "Wat is geloof eigenlijk, en hoe verschilt dat van weten?",
          "Hoe kies je een zendingsgebied?",
          "Wat is het verschil tussen doop en bevestiging?",
          "Hoe organiseer je een gemeenteactiviteit?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos en Raphael het verschil tussen geloof en kennis?",
        options: [
          "Geloof is overtuigd zijn zonder volledige zekerheid; kennis heb je niet meer nodig te geloven",
          "Geloof en kennis zijn precies hetzelfde",
          "Kennis is altijd zwakker dan geloof",
          "Geloof bestaat alleen bij kinderen, kennis alleen bij volwassenen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos zegt dat hij vaak liever getuigt van het effect dat zijn geloof in zijn leven heeft, dan simpelweg te zeggen \"ik weet het\".",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom zijn we volgens Raphael en Koos naar de aarde gestuurd zonder herinnering aan het voorbestaan?",
        options: [
          "Om geloof te kunnen oefenen",
          "Omdat herinneringen technisch onmogelijk zijn",
          "Om straf te ondergaan voor keuzes in het voorbestaan",
          "Om gelijk te zijn aan dieren",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken of \"geloven\" iets is wat iedereen doet, ook atheïsten",
          "Ze bespreken het verschil tussen geloof en kennis",
          "Ze bespreken getuigenissen waarin mensen zeggen \"ik weet\" in plaats van \"ik geloof\"",
          "Ze concluderen dat het hele plan van zaligheid draait om het oefenen van geloof",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe omschrijft Moroni geloof in Ether 12?",
        options: [
          "Hopen op iets dat je niet ziet",
          "Volledige, wetenschappelijke zekerheid hebben",
          "Een gevoel dat na verloop van tijd altijd verdwijnt",
          "Iets wat alleen profeten kunnen hebben",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Ether 12:6 ontvang je pas een getuigenis nádat je geloof op de proef is gesteld — niet ervoor.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wanneer toonde Christus zich volgens Ether 12 aan de mensen na zijn opstanding?",
        options: [
          "Pas nadat zij geloof in Hem hadden",
          "Alleen aan mensen die nog nooit van Hem gehoord hadden",
          "Aan iedereen, ongeacht geloof",
          "Alleen aan zijn twaalf apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Moroni in Ether 12 in de juiste volgorde.",
        items: [
          "Geloof is hopen op iets dat je niet ziet",
          "Je ontvangt geen getuigenis vóórdat je geloof op de proef is gesteld",
          "Christus toonde zich pas aan mensen die al geloof in Hem hadden",
          "Zo kunnen ook wij deelgenoot worden van die hemelse gave, door geloof",
        ],
      },
    ],
  },
  {
    number: 118,
    title: "Aflevering 118",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel staat in deze aflevering centraal?",
        options: ["Geloofsartikel 6 (kerkorganisatie)", "Geloofsartikel 2", "Geloofsartikel 11", "Geloofsartikel 13"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke ambten noemt geloofsartikel 6 als onderdeel van dezelfde organisatie als de vroegchristelijke kerk?",
        options: [
          "Apostelen, profeten, herders, leraars, evangelisten",
          "Alleen bisschoppen en priesters",
          "Alleen de paus en kardinalen",
          "Alleen de twaalf apostelen",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Koos en Raphael heet de kerk officieel \"De Kerk van Jezus Christus van de Heiligen der Laatste Dagen\" omdat de kerk van Christus is, niet van de heiligen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk voorbeeld noemen ze van voortdurende openbaring in het Nieuwe Testament, om de vroege kerk te laten groeien?",
        options: [
          "De openbaring dat het evangelie ook aan niet-Joden gebracht mocht worden",
          "De openbaring om de tempel in Jeruzalem te herbouwen",
          "De openbaring om een nieuwe kalender in te voeren",
          "De openbaring om Grieks als kerktaal te gebruiken",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 6 voor en bespreken de ambten die erin genoemd worden",
          "Ze bespreken waarom de kerk \"van Jezus Christus\" heet, en niet \"Mormoonse kerk\"",
          "Ze bespreken hoe de kerk na de apostelen verdween en later hersteld werd",
          "Ze bespreken voortdurende openbaring, met voorbeelden uit het Nieuwe Testament",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 6 wordt beschreven hoe de kerk onder de Nephieten georganiseerd was. Welke ambtsdragers worden daar genoemd?",
        options: ["Ouderlingen, priesters en leraren", "Alleen koningen", "Alleen profeten", "Ridders en edelen"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kwamen de leden van de kerk volgens Moroni 6 dikwijls samen?",
        options: [
          "Om te vasten, te bidden en met elkaar te spreken over het welzijn van hun ziel, en om het avondmaal te nemen",
          "Om alleen belastingen te innen",
          "Om oorlogsplannen te bespreken",
          "Om alleen feest te vieren",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 6 werd niemand tot de doop toegelaten, tenzij die zich oprecht van zijn zonden had bekeerd.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze beschrijvingen van de vroege kerk uit Moroni 6 in de juiste volgorde.",
        items: [
          "Mensen werden pas gedoopt na oprechte bekering",
          "Na de doop werden ze bij het volk van de kerk gerekend en hun naam opgeschreven",
          "De leden kwamen vaak samen om te vasten, te bidden en te spreken",
          "De bijeenkomsten werden geleid door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 117,
    title: "Aflevering 117",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk bijbelverhaal, uit het \"Kom en Volg mij\"-lesprogramma, bespreken Koos en Raphael in deze aflevering?",
        options: ["David en Goliath", "Noach en de ark", "Jozef en zijn broers", "Daniël in de leeuwenkuil"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom besloot David om tegen Goliath te vechten?",
        options: [
          "Hij kon niet verdragen dat Goliath het volk en de God van Israël bespotte",
          "De koning dwong hem ertoe",
          "Hij wilde beroemd worden",
          "Hij verloor een weddenschap",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "David weigerde het harnas van koning Saul te dragen omdat hij er niet aan gewend was en er niet in kon lopen.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waar had David geoefend met een slinger en stenen, voordat hij tegen Goliath vocht?",
        options: [
          "Als schaapherder, tegen leeuwen en beren die de kudde aanvielen",
          "Als soldaat in het leger van koning Saul",
          "Tijdens een speciale training aan het hof",
          "Hij had nooit eerder een slinger gebruikt",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken het verhaal van David en Goliath",
          "Ze bespreken de afstammingslijn van David naar Christus",
          "Ze filosoferen over voorbestemming versus keuzevrijheid",
          "Koos vertelt een persoonlijk verhaal over een \"toevallige\" vondst als zegening",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 13 wordt uitgelegd dat hogepriesters al \"sedert de grondlegging der wereld\" geroepen en voorbereid waren, wegens hun...",
        options: [
          "Buitengewone geloof en goede werken",
          "Afkomst en familienaam",
          "Rijkdom en aanzien",
          "Leeftijd",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Alma 13 de reden dat sommigen deze heilige roeping wél kregen en anderen niet?",
        options: [
          "Ieder had oorspronkelijk gelijke kansen; sommigen verkozen de Geest te verwerpen door verstoktheid van hart",
          "Het was volledig willekeurig",
          "Alleen wie rijk geboren werd, kon geroepen worden",
          "Iedereen kreeg exact dezelfde roeping",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 13 waren de hogepriesters vanaf het begin al hetzelfde als hun broeders, met dezelfde vrije keuze.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit Alma 13 over voorbeschikking in de juiste volgorde.",
        items: [
          "Aanvankelijk waren alle mensen gelijk, met dezelfde vrije keuze",
          "Sommigen oefenden buitengewoon geloof en goede werken uit",
          "Zij werden, naar Gods voorkennis, al vanaf de grondlegging der wereld voorbereid",
          "Zij werden geroepen en geordend tot het heilige priesterschap",
        ],
      },
    ],
  },
  {
    number: 116,
    title: "Aflevering 116",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag stelt Koos aan het begin van deze aflevering, die het hele gesprek op gang brengt?",
        options: [
          "Geniet jij nog wel een beetje van het leven?",
          "Wat is jouw favoriete Bijbelboek?",
          "Wil je ooit zendingspresident worden?",
          "Welke muziek luister je het liefst?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom drinken Koos en Raphael geen alcohol, koffie of thee?",
        options: [
          "Vanwege het Woord van Wijsheid, een leefregel van hun kerk",
          "Omdat het wettelijk verboden is in Nederland",
          "Omdat ze er allergisch voor zijn",
          "Omdat hun dokter het heeft afgeraden",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos vertelt dat hij het idee dat je alcohol nodig hebt om iets gezellig te maken, herkent bij vrienden die geen lid van de kerk zijn.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe omschrijft Koos zijn eigen definitie van \"zonde\"?",
        options: [
          "God niet goed genoeg of niet vaak genoeg betrekken in je leven — \"zonder\" God leven",
          "Elke overtreding van de Nederlandse wet",
          "Iets wat alleen kerkleiders kunnen begaan",
          "Uitsluitend het drinken van alcohol",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken waarvan ze zelf genieten in het leven",
          "Ze bespreken het Woord van Wijsheid en het beeld dat buitenstaanders daarvan hebben",
          "Ze bespreken of geboden je vrijheid beperken of juist beschermen",
          "Ze bespreken of God wil dat we van het leven genieten",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt Lehi in 2 Nephi 2:25 over het doel waarom mensen bestaan?",
        options: [
          "Adam viel, opdat de mensen zouden zijn; en de mensen zijn, opdat zij vreugde zullen hebben",
          "Mensen bestaan alleen om te lijden en te boeten",
          "Mensen bestaan om zich zoveel mogelijk af te zonderen van de wereld",
          "Mensen bestaan om rijkdom te vergaren",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 2 zijn mensen, na verlost te zijn van de val, vrij om zelfstandig te handelen en te kiezen tussen vrijheid en eeuwig leven, of gevangenschap en dood.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is er nodig, volgens 2 Nephi 2, om de mensenkinderen van de val te verlossen?",
        options: [
          "De komst van de Messias in de volheid der tijden",
          "Het bouwen van tempels",
          "Het houden van de wet van Mozes",
          "Het bereiken van rijkdom en aanzien",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit 2 Nephi 2 in de juiste volgorde.",
        items: [
          "Adam viel, opdat de mensen zouden bestaan",
          "De mensen bestaan opdat zij vreugde zullen hebben",
          "De Messias verlost de mensenkinderen van de val",
          "Zij worden vrij om zelfstandig te kiezen tussen vrijheid en gevangenschap",
        ],
      },
    ],
  },
  {
    number: 115,
    title: "Aflevering 115",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 5 (roeping door profetie en handoplegging)",
          "Geloofsartikel 1",
          "Geloofsartikel 8",
          "Geloofsartikel 12",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is nodig, volgens geloofsartikel 5, om het evangelie te mogen prediken en verordeningen te bedienen?",
        options: [
          "Geroepen worden door profetie en handoplegging van iemand met het juiste gezag",
          "Een universitaire theologische opleiding",
          "Minstens tien jaar lidmaatschap van de kerk",
          "Een aanbeveling van de burgemeester",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat hij, ook al draagt hij het priesterschap, zijn zesjarige zoon niet zomaar zelf het priesterschap mag geven zonder toestemming van iemand met de sleutels.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Koos leest een voorbeeld voor uit Numeri 27, waarin Mozes door handoplegging wie aanstelt als zijn opvolger?",
        options: ["Jozua", "Aäron", "Kaleb", "Eleazar"],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 5 voor en bespreken wat \"gezag\" precies inhoudt",
          "Ze bespreken het voorbeeld van Mozes die Jozua door handoplegging aanstelt",
          "Ze bespreken hoe Joseph Smith en Oliver Cowdery het priesterschap terug ontvingen",
          "Ze bespreken waarom de zoon van Joseph Smith geen automatische opvolger werd",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Moroni 3 wordt beschreven hoe discipelen priesters en leraren ordenden. Wat deden ze eerst, voordat ze de handen oplegden?",
        options: [
          "Zij baden tot de Vader in de naam van Christus",
          "Zij vastten veertig dagen",
          "Zij reisden naar Jeruzalem",
          "Zij wachtten op een droom",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In wiens naam ordenden de discipelen volgens Moroni 3 een priester of leraar?",
        options: ["In de naam van Jezus Christus", "In hun eigen naam", "In de naam van de koning", "Zonder een naam te noemen"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 3 ordenden de discipelen priesters en leraren door de macht van de Heilige Geest, die in hen was.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen van een ordening in Moroni 3 in de juiste volgorde.",
        items: [
          "De discipelen bidden tot de Vader in de naam van Christus",
          "Zij leggen de handen op het hoofd van de persoon",
          "Zij ordenen hem in de naam van Jezus Christus tot priester of leraar",
          "Dit gebeurt door de macht van de Heilige Geest die in hen is",
        ],
      },
    ],
  },
  {
    number: 114,
    title: "Aflevering 114",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke gasten schuiven in deze aflevering aan bij Koos en Raphael?",
        options: [
          "David en Kevin, makers van de Belgische podcast \"De Kast van Mormon\"",
          "Twee zendingspresidenten uit Utah",
          "Een historicus en een archeoloog",
          "Twee muzikanten van het kerkkoor",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is het \"Jesus Loves You\"-initiatief dat David beschrijft?",
        options: [
          "Gratis plastic poppetjes die mensen weggeven aan wie steun kan gebruiken",
          "Een jaarlijkse liefdadigheidsloop",
          "Een gratis Bijbel-app",
          "Een reeks kerstkaarten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "David vertelt dat hij als wetenschapper en computeringenieur het Boek van Mormon onderzocht en tot de conclusie kwam dat de meest simpele verklaring is dat het goddelijke openbaring is.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kozen David en Kevin ervoor om de naam van hun kerk wél expliciet in hun podcastnaam en -omschrijving te noemen?",
        options: [
          "Om heel bewust het nieuws over hun kerk in een positief daglicht te kunnen behandelen",
          "Omdat het verplicht was door de kerk",
          "Om reclame-inkomsten te verhogen",
          "Om verwarring met andere podcasts te voorkomen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "David en Kevin stellen zichzelf en hun podcast voor",
          "David vertelt zijn bekeringsverhaal als voormalig atheïstische wetenschapper",
          "David vertelt over het \"Jesus Loves You\"-poppetjesinitiatief",
          "Kevin sluit af met een uitnodiging gebaseerd op Moroni 10",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Kevin citeert aan het eind van de aflevering Moroni 10:3-5. Waartoe spoort Moroni de lezer daar toe aan?",
        options: [
          "Om God in de naam van Christus te vragen of het Boek van Mormon waar is",
          "Om het boek driemaal te lezen voordat je het gelooft",
          "Om naar een profeet te reizen voor bevestiging",
          "Om te wachten op een droom",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Met welke drie dingen moet je die vraag volgens Moroni 10:4 stellen om een antwoord te ontvangen?",
        options: [
          "Een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Een getuige, een notaris en een advocaat",
          "Vasten, een offer en een gelofte",
          "Geduld, geld en tijd",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Moroni 10:5 kun je door de macht van de Heilige Geest de waarheid van alle dingen kennen, niet alleen van het Boek van Mormon.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Moroni's aansporing in Moroni 10 in de juiste volgorde.",
        items: [
          "Bedenk hoe barmhartig de Heer is geweest sinds de schepping van Adam",
          "Vraag God, de eeuwige Vader, in de naam van Christus of het waar is",
          "Vraag met een oprecht hart, een eerlijke bedoeling en geloof in Christus",
          "Ontvang de waarheid geopenbaard door de macht van de Heilige Geest",
        ],
      },
    ],
  },
  {
    number: 113,
    title: "Aflevering 113",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Uit welk bijbelboek leest Koos aan het begin van deze aflevering, waarin Mozes zijn laatste woorden aan het volk geeft?",
        options: ["Deuteronomium", "Genesis", "Exodus", "Numeri"],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er met de eerste stenen tafelen die Mozes van de berg meebracht?",
        options: [
          "Mozes gooide ze kapot uit woede over het gouden kalf",
          "Ze werden gestolen door de Filistijnen",
          "Ze smolten in de zon",
          "Ze werden in de ark van het verbond bewaard en nooit meer gezien",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos en Raphael geloven dat de tweede set stenen tafelen een eenvoudigere versie van de wet bevatte dan de eerste set.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke lastige vraag stellen Koos en Raphael zich over \"de andere wang toekeren\"?",
        options: [
          "Of het christelijk is om altijd maar alles over je heen te laten komen",
          "Of je wel of niet naar de kerk mag gaan zonder tien te betalen",
          "Of je wel mag werken op zondag",
          "Of je kinderen wel opvoeding mogen krijgen buiten de kerk",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken Mozes' laatste boodschap in Deuteronomium",
          "Ze bespreken de twee sets stenen tafelen met de tien geboden",
          "Ze bespreken overeenkomsten tussen de oudtestamentische tabernakel en de tempel van nu",
          "Ze bespreken of \"de andere wang toekeren\" betekent dat je alles moet accepteren",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 3 Nephi 12 (de leer op de tempel) leert Christus over \"de andere wang toekeren\". Wat zegt Hij precies?",
        options: [
          "Het kwaad niet te weerstaan, en wie u op de rechterwang slaat, ook de andere toe te keren",
          "Om altijd onmiddellijk terug te vechten",
          "Om conflicten volledig te vermijden",
          "Om een rechtszaak aan te spannen tegen wie je kwaad doet",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat leert Christus in datzelfde hoofdstuk over hoe je met je vijanden moet omgaan?",
        options: [
          "Heb uw vijanden lief, zegen hen die u vervloeken en bid voor wie u vervolgen",
          "Vermijd vijanden volledig en negeer ze",
          "Beantwoord kwaad met kwaad, oog om oog",
          "Vraag de rechter om wraak te nemen namens jou",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 3 Nephi 12 is het doel van het liefhebben van je vijanden dat je kinderen wordt van je Vader in de hemel.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze leringen van Christus uit 3 Nephi 12 in de juiste volgorde.",
        items: [
          "Weersta het kwaad niet, en keer de andere wang toe",
          "Geef aan wie van u vraagt, en wend u niet af van wie wil lenen",
          "Heb uw vijanden lief en zegen wie u vervloeken",
          "Zo wordt u kinderen van uw Vader in de hemel",
        ],
      },
    ],
  },
  {
    number: 112,
    title: "Aflevering 112",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 4 (de eerste beginselen en verordeningen)",
          "Geloofsartikel 7",
          "Geloofsartikel 10",
          "Geloofsartikel 3",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zijn volgens geloofsartikel 4 de vier eerste beginselen en verordeningen van het evangelie?",
        options: [
          "Geloof in Jezus Christus, bekering, doop door onderdompeling, handoplegging voor de Heilige Geest",
          "Vasten, offergaven, tempeldienst, zending",
          "Gebed, schriftstudie, tiende, kerkbezoek",
          "Doop, avondmaal, huwelijk, begrafenis",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael vergelijkt de doop met een sleutel die het pad opent dat terugleidt naar Hemelse Vader — niet het einddoel zelf, maar het begin.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom nemen leden van de kerk volgens Koos en Raphael elke week het avondmaal?",
        options: [
          "Om hun doopverbond te vernieuwen en dat verbond levend te houden",
          "Omdat het verplicht is door de wet",
          "Om hun lidmaatschap opnieuw te bevestigen elke maand",
          "Om een nieuwe naam te ontvangen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 4 voor en bespreken de volgorde van de vier beginselen",
          "Ze bespreken waarom de doop gekoppeld is aan vergeving van zonden",
          "Ze bespreken het avondmaal als vernieuwing van het doopverbond",
          "Ze concluderen dat de doop een begin is, geen eindpunt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In 2 Nephi 31 legt Nephi \"de leer van Christus\" uit. Wat noemt hij als de poort waardoor je moet binnengaan?",
        options: [
          "Bekering en doop door onderdompeling",
          "Het betalen van tiende",
          "Het bouwen van een tempel",
          "Het reizen naar Jeruzalem",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurt er volgens 2 Nephi 31 nadat je door de poort bent gegaan en de Heilige Geest hebt ontvangen?",
        options: [
          "Je moet met standvastig geloof in Christus voortgaan tot het einde",
          "Dan is alles klaar en hoef je niets meer te doen",
          "Dan mag je zelf bepalen of je nog geboden houdt",
          "Dan begint het proces helemaal opnieuw",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 31 is er geen andere weg of naam onder de hemel gegeven waardoor de mens behouden kan worden in het koninkrijk van God.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze stappen uit Nephi's \"leer van Christus\" in 2 Nephi 31 in de juiste volgorde.",
        items: [
          "Je gaat door de poort: bekering en doop",
          "Je ontvangt de Heilige Geest",
          "Je streeft standvastig voorwaarts, met hoop en liefde",
          "Je volhardt tot het einde en ontvangt het eeuwige leven",
        ],
      },
    ],
  },
  {
    number: 111,
    title: "Aflevering 111",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke prikkelende vraag stelt Koos aan het begin van deze aflevering, naar aanleiding van zijn Bijbellezing in Exodus?",
        options: [
          "Vindt Raphael dat God humor heeft?",
          "Waarom werden er geen vrouwelijke profeten geroepen?",
          "Waarom duurde de schepping zes dagen?",
          "Waarom mocht Mozes het beloofde land niet in?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er toen Mozes zijn staf op de grond gooide, op Gods aanwijzing?",
        options: ["De staf werd een slang", "De staf brak in tweeën", "De staf werd goud", "Er niets"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Toen het volk in de woestijn klaagde over honger, stuurde God zowel manna als kwartels.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat gebeurde er nadat het volk bleef klagen en God vurige (giftige) slangen stuurde?",
        options: [
          "Mozes maakte een koperen slang; wie ernaar keek, werd genezen",
          "Het volk moest veertig dagen vasten als straf",
          "Alle slangen verdwenen vanzelf na een week",
          "Mozes bad en de slangen werden onmiddellijk gedood",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gebeurtenissen uit Exodus, zoals besproken in de aflevering, in de juiste volgorde.",
        items: [
          "Mozes' staf verandert in een slang bij de brandende struik",
          "De tien plagen treffen Egypte, en de Israëlieten vertrekken",
          "Het volk klaagt in de woestijn over honger en dorst",
          "Vurige slangen bijten het klagende volk, en de koperen slang geneest hen",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Alma 33 legt Alma uit waar de koperen slang van Mozes een zinnebeeld van was. Waarvan?",
        options: [
          "Van Christus — wie op Hem vertrouwt en \"kijkt\", zal genezen worden",
          "Van de wet van Mozes in het algemeen",
          "Van de duivel die overwonnen moet worden",
          "Van de twaalf stammen van Israël",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom kwamen sommigen om, ondanks dat de genezing zo eenvoudig was als kijken naar de slang?",
        options: [
          "Wegens de verstoktheid van hun hart wilden zij niet kijken",
          "Ze waren te ver weg om het te zien",
          "De slang was op dat moment kapot",
          "Ze waren al genezen voordat ze konden kijken",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Alma 33 zouden mensen, als ze eenvoudig genezen konden worden door hun ogen op te slaan, dat zeker snel doen — tenzij hun hart verstokt is.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Alma over de koperen slang in Alma 33 in de juiste volgorde.",
        items: [
          "Mozes richtte in de wildernis een zinnebeeld op",
          "Wie ernaar keek, leefde",
          "Velen weigerden te kijken, wegens de verstoktheid van hun hart",
          "Alma roept op de ogen op te slaan en in de Zoon van God te geloven",
        ],
      },
    ],
  },
  {
    number: 110,
    title: "Aflevering 110",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welk geloofsartikel bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Geloofsartikel 3 (redding door de verzoening en gehoorzaamheid)",
          "Geloofsartikel 6",
          "Geloofsartikel 9",
          "Geloofsartikel 12",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat zegt geloofsartikel 3 over hoe de mensheid gered kan worden?",
        options: [
          "Door de verzoening van Christus, én door gehoorzaamheid aan de wetten en verordeningen van het evangelie",
          "Alleen door één keer te verklaren dat je Christus accepteert",
          "Alleen door goede werken, zonder dat Christus nodig is",
          "Door geboorte in een bepaald land",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Koos legt uit dat sommige andere christelijke stromingen geloven dat je alleen Christus als redder hoeft te accepteren, zonder verdere verordeningen — iets waarin hun kerk dus verschilt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke verordening noemen Koos en Raphael als absolute noodzaak om in het koninkrijk van God te komen?",
        options: ["Doop", "Het huwelijk", "Vasten", "Tempelbezoek"],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze lezen geloofsartikel 3 voor en bespreken wat opvalt",
          "Ze bespreken hoe dit verschilt van \"eenmalig accepteren is genoeg\"-geloofsopvattingen",
          "Ze proberen te achterhalen welke \"wetten\" precies bedoeld worden",
          "Ze concluderen dat geloof zonder werken dood is",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke beroemde uitspraak doet Nephi in 2 Nephi 25:23 over genade en eigen inspanning?",
        options: [
          "Wij weten dat wij, na alles wat wij kunnen doen, door genade worden gered",
          "Genade is niet nodig als je genoeg goede werken doet",
          "Alleen wie de wet van Mozes volledig houdt, wordt gered",
          "Redding is volledig onafhankelijk van Christus",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom bleven Nephi en zijn volk de wet van Mozes onderhouden, terwijl ze al in Christus geloofden?",
        options: [
          "Ze zagen ernaar uit naar Christus, totdat de wet vervuld zou zijn, en hielden de wet vanwege de geboden",
          "Ze wisten nog niets van Christus",
          "De wet van Mozes had niets met Christus te maken",
          "Ze deden het uit angst voor straf, niet uit geloof",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens 2 Nephi 25:26 schreven Nephi en de zijnen over Christus, verheugden zij zich in Christus en profeteerden zij over Christus, opdat hun kinderen zouden weten op welke bron zij konden vertrouwen voor vergeving.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen uit 2 Nephi 25 in de juiste volgorde.",
        items: [
          "Nephi's volk gelooft in Christus, maar houdt ook de wet van Mozes",
          "Zij zien standvastig naar Christus uit, totdat de wet vervuld zal zijn",
          "Zij schrijven, prediken en profeteren over Christus",
          "Zij worden, na alles wat zij kunnen doen, door genade gered",
        ],
      },
    ],
  },
  {
    number: 109,
    title: "Aflevering 109",
    summary: "Wordt bijgewerkt vanuit de podcastfeed.",
    content: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Welke vraag van een luisteraar bespreken Koos en Raphael in deze aflevering?",
        options: [
          "Is geen seks voor het huwelijk wel zo'n goed idee?",
          "Mag je trouwen zonder kerkelijke plechtigheid?",
          "Hoeveel kinderen moet je krijgen?",
          "Mag je scheiden als lid van de kerk?",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Wat is volgens Koos het verschil tussen de twee grote geboden en de vijf wetten?",
        options: [
          "De twee geboden (God en je naaste liefhebben) vallen onder de wet van het evangelie, één van de vijf wetten",
          "Er is helemaal geen verschil",
          "De vijf wetten zijn ouder dan de twee geboden",
          "De twee geboden gelden alleen voor profeten",
        ],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Raphael legt uit dat een huwelijk voor de wet, zonder tempelverzegeling, in hun geloofsovertuiging niet \"voor tijd en alle eeuwigheid\" geldt.",
        answer: true,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Waarom is exclusiviteit (alleen seks met je huwelijkspartner) volgens Raphael belangrijk?",
        options: [
          "Het beschermt het gezin en de relatie tegen schade van buitenaf",
          "Het heeft geen enkele functie, het is puur een regel",
          "Het is alleen belangrijk voor de kerkleider, niet voor gewone leden",
          "Het voorkomt uitsluitend financiële problemen",
        ],
        correctIndex: 0,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze onderwerpen in de volgorde waarin ze in de aflevering aan bod komen.",
        items: [
          "Ze bespreken de luisteraarsvraag over seks voor het huwelijk",
          "Ze bespreken het verschil tussen de twee geboden en de vijf wetten",
          "Ze bespreken wat een eeuwig huwelijk (verzegeling) anders maakt dan een gewoon huwelijk",
          "Ze bespreken waarom exclusiviteit een relatie beschermt",
        ],
      },
    ],
    bomConnection: [
      {
        type: "MULTIPLE_CHOICE",
        prompt: "In Jakob 2 waarschuwt Jakob het volk streng tegen onkuisheid. Wat zegt de Heer daar via Jakob over de kuisheid van vrouwen?",
        options: [
          "Ik, de Heer God, schep behagen in de kuisheid der vrouwen",
          "Kuisheid is alleen belangrijk voor priesters",
          "Kuisheid is een menselijke uitvinding, geen goddelijk gebod",
          "Alleen mannen hoeven kuis te zijn",
        ],
        correctIndex: 0,
      },
      {
        type: "MULTIPLE_CHOICE",
        prompt: "Hoe noemt Jakob hoererij (onkuisheid) in dit hoofdstuk?",
        options: ["Een gruwel in Gods ogen", "Een klein foutje zonder gevolgen", "Een privékwestie die niemand aangaat", "Een wettelijk toegestane keuze"],
        correctIndex: 0,
      },
      {
        type: "TRUE_FALSE",
        prompt: "Volgens Jakob 2 waarschuwt de Heer dat het land vervloekt zal worden als het volk zijn geboden, waaronder kuisheid, niet onderhoudt.",
        answer: true,
      },
      {
        type: "SEQUENCE",
        prompt: "Zet deze gedachtestappen van Jakob over kuisheid in Jakob 2 in de juiste volgorde.",
        items: [
          "Jakob spreekt het volk streng toe over hun zonden",
          "Hij zegt dat de Heer behagen schept in de kuisheid der vrouwen",
          "Hij noemt hoererij een gruwel in Gods ogen",
          "Hij waarschuwt dat het land vervloekt wordt als de geboden niet onderhouden worden",
        ],
      },
    ],
  },
];
