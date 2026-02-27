# Zeitstempel (Supabase) – sofort nutzbares Stempel-/Saldo-System

## 1) Voraussetzungen
- Node.js 20+
- Ein Supabase Projekt (kostenlos reicht)

## 2) Supabase einrichten
1. Neues Supabase Projekt erstellen
2. In Supabase: **SQL Editor** öffnen und den Inhalt aus `supabase/schema.sql` ausführen
3. In Supabase: **Authentication → Providers**: Email aktivieren (Password-Login)  
   Optional: “Confirm email” je nach Wunsch an/aus.

## 3) ENV setzen
Lege im Projekt eine Datei `.env.local` an:

```
NEXT_PUBLIC_SUPABASE_URL=... (Supabase Project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=... (Anon Key)
SUPABASE_SERVICE_ROLE_KEY=... (Service role key; nur serverseitig genutzt)
```

> Die Keys findest du in Supabase unter **Project Settings → API**.

## 4) Start
```
npm install
npm run dev
```
Dann: http://localhost:3000

## 5) Erster Admin
- Registriere dich im Login-Screen (E-Mail + Passwort)
- Danach in Supabase: Tabelle `profiles` öffnen und für deinen User `role` auf `admin` setzen
- Danach kannst du im Admin-Bereich Kollegen einladen/aktivieren (oder sie registrieren sich selbst)

## 6) Regeln (fix)
- Pause immer 60 Minuten (automatischer Abzug)
- Sollzeit: Mo–Do 8:00 netto, Fr 7:00 netto
- Arbeitsfenster: Mo–Do 08:00–17:00, Fr 08:00–16:00 (nur als Orientierung; die Berechnung basiert auf Stempelzeiten)

## 7) Hinweis
Dieses MVP lässt absichtlich Dinge wie Feiertage/Urlaub/Krank weg. Das kann man leicht ergänzen (Abwesenheits-Tabelle, Soll=0).
