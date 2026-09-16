import { prisma } from "../lib/prisma";

export async function testimonySeed() {
  const defaultTestimonies = [
    {
      name: "Jonas",
      title: "Jeg fik troen på mig selv tilbage",
      content:
        "Jeg havde været ledig i et stykke tid og var efterhånden begyndt at tvivle på, hvad jeg egentlig kunne. Gennem Gratissimo fandt jeg en frivillig plads i en lokal forening, hvor jeg kunne bruge nogle af de ting, jeg allerede var god til. Det gav mig noget at stå op til og ikke mindst lidt mere selvtillid. Efter nogle måneder fik jeg faktisk et job gennem en kontakt, jeg havde fået som frivillig.",
    },
    {
      name: "Mette",
      title: "Jeg ville bare gerne møde nogle nye mennesker",
      content:
        "Efter jeg flyttede til en ny by, savnede jeg et fællesskab. Jeg fandt et opslag på Gratissimo, hvor de manglede frivillige på et kulturhus. Jeg tænkte, at jeg kunne prøve det af et par timer om ugen. Det endte med at blive meget mere end det. Jeg har mødt en masse søde mennesker og føler mig nu meget mere hjemme i byen.",
    },
    {
      name: "Anders",
      title: "Mine IT-evner kan bruges til noget godt",
      content:
        "Jeg sidder normalt foran en computer hele dagen på mit arbejde, men havde længe haft lyst til at bruge mine evner på noget andet. På Gratissimo fandt jeg en forening, der havde brug for hjælp til deres hjemmeside. Det var en lille opgave til at starte med, men det har været virkelig fedt at kunne se, at det jeg laver rent faktisk hjælper nogen.",
    },
    {
      name: "Sofie",
      title: "Det gav mig noget at skrive på mit CV",
      content:
        "Som nyuddannet var det frustrerende at få at vide, at jeg manglede erfaring, når jeg ikke kunne få et job uden erfaring. Jeg fandt et frivilligt arbejde inden for kommunikation gennem Gratissimo. Her fik jeg lov til at arbejde med sociale medier, tekster og kampagner. Det gav mig konkrete ting at vise til jobsamtaler, og nogle måneder senere fik jeg mit første job inden for mit fag.",
    },
    {
      name: "Peter",
      title: "En kop kaffe kan faktisk gøre en forskel",
      content:
        "Jeg gik på pension og fandt hurtigt ud af, at jeg savnede at have noget fast at stå op til. Jeg fandt et opslag om at blive besøgsven gennem Gratissimo. Nu besøger jeg en ældre mand en gang om ugen. Vi drikker kaffe, snakker om alt muligt og går nogle gange en tur. Det er blevet et af ugens højdepunkter for os begge.",
    },
    {
      name: "Camilla",
      title: "Jeg fandt noget, jeg virkelig brænder for",
      content:
        "Jeg har altid været glad for dyr, så da jeg så et opslag fra et dyreinternat, tænkte jeg, at jeg lige så godt kunne prøve. Jeg startede med et par timer om ugen og blev hurtigt bidt af det. I dag glæder jeg mig hver uge til mine vagter, og jeg er faktisk begyndt at undersøge, om jeg skal uddanne mig inden for området.",
    },
    {
      name: "Rasmus",
      title: "Det fik mig ud af døren igen",
      content:
        "Jeg havde haft en periode, hvor jeg mest gik derhjemme og ikke rigtig kom ud. Jeg havde egentlig lyst til at lave noget, men vidste ikke helt hvad. Gratissimo gjorde det nemt at finde noget, der ikke krævede, at jeg skulle binde mig til en masse timer. Jeg startede med at hjælpe til ved nogle lokale arrangementer. Det lyder måske ikke af meget, men for mig gjorde det en kæmpe forskel.",
    },
    {
      name: "Louise",
      title: "Jeg skulle bare tage det første skridt",
      content:
        "Jeg havde snakket om at blive frivillig i lang tid, men jeg fik aldrig rigtig gjort noget ved det. Så fandt jeg Gratissimo og begyndte at kigge på opslag. Jeg fandt en lektiecafé, hvor jeg hjælper børn med deres lektier én eftermiddag om ugen. Det passer perfekt ind i min hverdag, og jeg går næsten altid derfra i bedre humør, end da jeg kom.",
    },
  ];

  for (const testimony of defaultTestimonies) {
    prisma.testimony
      .create({ data: testimony })
      .then(() => {
        console.log(`Testimony ${testimony.name} created successfully.`);
      })
      .catch((error: Error) => {
        console.error(`Error creating job category ${testimony.name}:`, error);
      });
  }
}
