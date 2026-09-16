# Prisma Gratissimo API

---

## Beskrivelse

**Webudvikler Uddannelsen - TechCollege 2026**

Dette API er lavet som datagrundlag til svendeprøve opgaven "Gratissimo".
Følg instrukserne herunder for at installere og opsætte API´et lokalt på din maskine.

---

## Installation

Clone repositoriet og installer afhængigheder med NPM:

```bash
git clone <repo-url>
```

Naviger til roden af projektet og skriv i terminalen:

```bash
npm install
```

---

## Setup

Kopier env eksemplet ved at skrive:

```bash
cp .env.example .env
```

`.env` filen indeholder allerede alt du skal bruge for at starte API´et.

**Skriv nu følgende kommander én efter én:**

```bash
npm run migrate
```

```bash
npm run generate
```

```bash
npm run dev
```

Nu skulle serveren gerne starte på: `localhost:4000`

---

## Available Scripts

| Script          | Kommando           | Beskrivelse                              |
| --------------- | ------------------ | ---------------------------------------- |
| Start server    | `npm run dev`      | Kører express serveren med `tsx --watch` |
| Migrate         | `npm run migrate`  | Tilføjer skema til SQlite databasen.     |
| Generate client | `npm run generate` | Genererer prisma klienten                |
| Seed database   | `npm run seed`     | Fylder databasen med start data          |

---

## API Dokumentation

Dokumentation til API´et og alle tilhørende routes findes her:
([Postman Dokumentaion](https://documenter.getpostman.com/view/31531123/2sBYAuTBzo))

## Projektets skruktur

```
prisma/
  schema.prisma           # Master Prisma skema (generator + datasource)
  models/                 # En .prisma file per model
  migrations/             # Auto-genereret migration historie
src/
  controllers/            # En controller class per model
  routes/                 # En route fil per model
  seeds/                  # En seed fil per model + initSeeding.ts
  index.ts                # App start, - Starter Prisma client instance
generated/prisma/         # Auto-genereret Prisma client (Må ikke ændres)
dev.db                    # SQLite database fil
```

---
