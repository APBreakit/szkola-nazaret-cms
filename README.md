# Katolicka Szkoła Podstawowa im. Świętej Rodziny z Nazaretu - CMS

System zarządzania treścią (CMS) dla Katolickiej Szkoły Podstawowej im. Świętej Rodziny w Gdyni.

## Technologie

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Backend**: Next.js Server Actions, PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **UI**: Shadcn UI, Radix UI, Framer Motion
- **Deployment**: Coolify (Docker Standalone)

## Struktura Projektu

- `src/app`: Główne ścieżki i strony aplikacji (v0 reference design)
- `src/components`: Reużywalne komponenty UI
- `src/lib`: Logika biznesowa, autoryzacja, baza danych (Prisma shim)
- `prisma/`: Definicja schematu bazy danych

## Wdrażanie (Coolify)

Aplikacja jest automatycznie wdrażana przez Coolify z repozytorium GitHub.

**URL**: [https://szkola.breackly.cloud](https://szkola.breackly.cloud)

**Główne Secje:**
- `/admin`: Panel administracyjny
- `/aktualnosci`: Aktualności i wydarzenia
- `/ogloszenia`: Ważne komunikaty
- `/grupy`: Zarządzanie grupami/klasami
- `/jadlospis`: Centralny jadłospis

## Autorzy

Projekt oparty na referencyjnym systemie CMS od APBreakit, dostosowany dla potrzeb Katolickiej Szkoły Podstawowej.
