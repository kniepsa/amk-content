# Bookkeeping Agent — Belege automatisch sammeln & an DATEV weiterleiten

## Status: Planned — Phase 1 ready to build

## Problem

Belege für 3 Firmen kommen aus dutzenden Quellen (Emails + Online-Portale).
Kein bestehendes Tool löst den Portal-Abruf automatisch:

- BuchhaltungsButler, sevDesk, Lexoffice: erwarten manuellen Upload oder GetMyInvoices-Integration
- **GetMyInvoices** (direkter Wettbewerber): löst Portal-Scraping für 10k+ Portale, ~€15-30/Monat —
  aber: generisch, kein Telegram, kein AI-Kategorisierung, kein Multi-Country, kein Xero

## Der eigentliche Wert

Nicht nur Beleg-Sammlung — sondern **vollständige Vorkontierung**:

1. Belege automatisch finden (Email + Portal-Scraping)
2. AI-Matching: Beleg ↔ Banktransaktion
3. Claude Vision: alle Line Items extrahieren + DATEV-Konto pro Position zuweisen (Kontierung)
4. Telegram: Kontierung bestätigen / korrigieren
5. GoBD-konforme Ablage + DATEV-Export mit fertiger Kontierung

Der Steuerberater bekommt **fertig kontierte Buchungen** — er muss nur noch prüfen und freigeben.

## Architecture

```
MONATLICHER TRIGGER (/scan in Telegram oder cron)
    ↓
Bank-Transaktionen abrufen
    → Qonto API — GET /v2/transactions (Bonn Gastro / Qonto-Konto direkt)
    → GoCardless API — Vivid, Kreissparkasse, Volksbank (PSD2, free)
    → Xero Bank Feed — Standard Bank SA (Printulu, nativ in Xero)
    → "Welche Transaktionen haben noch keinen Beleg?"
    ↓
Für jede fehlende Transaktion:
    1. IMAP Email-Suche (Vendor-Name + Betrag + Datumsfenster)  → ~90% gefunden
    2. Playwright Browser-Automation → Portal-Login → PDF-Download → Rest
    ↓
Claude Vision — vollständige Vorkontierung (alle Line Items)
    → Pro Beleg: ALLE Positionen extrahieren
    → Jede Position → DATEV SKR03/SKR04-Konto zuweisen (Vorkontierung)
    → Bonn Gastro: Reinigung → 6300, Küche → 4000, Getränke → 4100
    → Structured Outputs (Pydantic) — kein Parser-Fehler möglich
    ↓
Telegram — Vorkontierung bestätigen / korrigieren
    → "🧾 REWE GmbH — Bonn Gastro (28.02.2026)
         €45.00 Domestos       → 6300 Reinigung   [✅ ✏️]
         €134.50 Schweinebauch → 4000 Küche        [✅ ✏️]
         €55.00 Heineken       → 4100 Getränke     [✅ ✏️]
       Gesamt: €234.50 | [✅ Alle buchen] [❌ Skip]"
    → Edit-Flow: ✏️ → Bot fragt Konto → User tippt "6800" → übernommen
    ↓ (on confirm)
GoBD-Ablage + DATEV-Export mit fertiger Vorkontierung
    → Supabase Storage: PDF unveränderlich archiviert
    → DATEV Buchungsstapel: fertig vorkontiert (Steuerberater arbeitet nur mit Summen)
```

## Stack

| Layer              | Tech                             | Reason                                            |
| ------------------ | -------------------------------- | ------------------------------------------------- |
| Runtime            | Python 3.12                      | Beste Ecosystem-Abdeckung                         |
| AI                 | Claude claude-sonnet-4-6         | PDF-Vision, Header-Extraktion, Structured Outputs |
| Bank               | GoCardless Bank Account Data API | Free, PSD2, Vivid + Kreissparkasse + Volksbank ✅ |
| Email              | `imaplib` (stdlib)               | Kein Overhead, liest IMAP direkt                  |
| PDF                | Claude Vision (nativ)            | Multi-page PDFs in einem API Call                 |
| Browser-Automation | Playwright (Python)              | Portal-Logins für nicht-Email Rechnungen          |
| Telegram           | `python-telegram-bot` v21        | Async, Inline-Buttons für Confirm/Skip            |
| Hosting            | Railway                          | Single Service, Env Vars                          |
| Storage            | Supabase Storage + DB            | GoBD-konforme Ablage, Audit-Log                   |
| Export             | DATEV Buchungsstapel (ASCII)     | Standard-Format                                   |

## Banken

| Firma                  | Banken                                    | Zugriff                                                |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Bonn Gastro GmbH       | Vivid Money + Kreissparkasse Köln + Qonto | Qonto API direkt + GoCardless für Vivid/Kreissparkasse |
| Em Höttche             | Volksbank Köln Bonn                       | GoCardless                                             |
| Salvator Betriebs GmbH | Kreissparkasse Köln + Volksbank Köln Bonn | GoCardless                                             |
| Printulu (SA)          | Standard Bank SA                          | Xero Bank Feed nativ                                   |

## File Structure (`~/Projects/bookkeeping-agent/`)

```
bookkeeping-agent/
├── main.py                 # Einstieg: Telegram Bot + APScheduler (monatlicher Cron)
├── config.py               # Firma-Konfigurationen aus Env Vars
├── bank/
│   ├── qonto.py            # Qonto API — GET /v2/transactions (Bonn Gastro)
│   └── gocardless.py       # GoCardless Bank Account Data API (alle anderen DE-Konten)
├── receipts/
│   ├── email_search.py     # IMAP-Suche nach Vendor + Betrag + Datum
│   └── portal_scraper.py   # Playwright: Portal-Login → PDF-Download
├── extraction/
│   └── extractor.py        # Claude Vision → Header-Daten + Vorkontierung (Pydantic)
├── storage/
│   ├── archive.py          # Supabase Storage Upload + Metadaten speichern
│   └── audit.py            # GoBD Audit-Log: jede Aktion unveränderlich protokolliert
├── export/
│   └── datev_csv.py        # DATEV Buchungsstapel ASCII generieren
├── telegram_bot.py         # Bestätigungs-Flow, /scan Command, Inline-Buttons
├── policy.py               # IronCurtain-Whitelist: Agent darf nur lesen + extrahieren
├── Dockerfile
├── railway.toml
└── .env.example
```

## Phasen

**Phase 1 (jetzt):** Email + GoCardless + Claude Vision + Telegram + DATEV CSV
**Phase 2:** Playwright Portal-Scraping für häufigste Lieferanten (METRO, REWE, Telekom)
**Phase 3:** Xero für Printulu / SA — separater Backend-Adapter

## Competitor Landscape

| Tool               | Portal-Scraping | Email     | Bank-Feed     | AI-Kategorisierung | Telegram | Multi-Country | Preis     |
| ------------------ | --------------- | --------- | ------------- | ------------------ | -------- | ------------- | --------- |
| **Unser Agent**    | ✅ Custom       | ✅        | ✅ GoCardless | ✅ Claude          | ✅       | ✅            | ~€10/mo   |
| GetMyInvoices      | ✅ 10k Portale  | ✅        | ✅            | ❌                 | ❌       | Teilweise     | €15-30/mo |
| BuchhaltungsButler | ❌              | Teilweise | ✅            | ✅                 | ❌       | ❌            | €29+/mo   |
| sevDesk            | ❌              | ❌        | ✅            | ❌                 | ❌       | ❌            | €13+/mo   |

## Security (IronCurtain-Prinzipien)

- **Credential Separation**: Claude sieht nie API-Keys — nur typed Wrapper-Methoden
- **Policy Whitelist**: Agent darf nur `extract_header()` und `search_email()` — kein direktes HTTP
- **Audit-Log**: Jede Aktion vor Ausführung geloggt (approved_by = Telegram User ID)
- **TELEGRAM_ALLOWED_USER_ID**: Nur definierter User kann Bot nutzen

## Verification Checklist

1. `python main.py` — GoCardless Consent-Flow einmal im Browser durchlaufen
2. `/scan` in Telegram → Transaktionen der letzten 30 Tage erscheinen
3. Test-Rechnung per Email schicken → Telegram-Bestätigung prüfen
4. Bestätigen → Supabase Storage prüfen (Datei vorhanden + Audit-Log-Eintrag)
5. DATEV CSV generieren → mit Steuerberater kompatibel prüfen
6. Railway Deploy: `railway up` → Logs prüfen

## Project Location

`~/Projects/bookkeeping-agent/`
