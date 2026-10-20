# Residencial Karla IX — Portal (project knowledge)

## What this is
A residential building management web app with two portals:
- **Admin**: manage apartment/resident accounts, edit income (maintenance + propane gas),
  expenses, the financial statement, and review/approve payment reports.
- **Resident**: view their own payment history and pending balance, and submit a payment report.

Seeded with **sample data** (14 units, 1C–4D, Sept. 2025 – Dec. 2026) shaped like the building's
financial-statement spreadsheet. Real figures are not included in this repository.

## Two versions, kept separately
1. **`residencial_karla_ix.jsx`** — for the Claude.ai chat artifact panel.
   Storage: `window.storage` (shared, key-value). Icons: `lucide-react`. Charts: `recharts`.
2. **`residencial-karla-ix.html`** — published, standalone page at a shareable claude.ai link.
   No build step: React 18 + ReactDOM 18 + Babel Standalone loaded via `<script>` tags from
   jsdelivr, Tailwind via the Play CDN script. Storage: the **`db` runtime capability**
   (`await window.claude.use("db")`), which is a real-time shared document store scoped to the
   artifact. Icons are hand-drawn inline SVGs (no lucide-react — no reliable browser build).
   Charts are a hand-drawn inline SVG bar+line chart (no recharts — same reason).

**Important constraint on the published version:** the `db` capability is organization-internal —
only viewers signed into the *same Claude organization* as the artifact's owner can read/write
shared data. Residents without an account in that organization can open the link but won't have
synced data. This matters if residents are the general public rather than org members.

## Data model (same shape in both versions)
- `config`: `{ residencialName, months: ["YYYY-MM", ...], adminUsername, adminPassword }`
- `apartments`: array of
  `{ id, residentName, username, password, pendingBalance, maint: {month: amount|null}, gas: {month: amount|null} }`
- `expenses`: `{ residential: [{id, concept, amounts:{month:amount}}], gas: [...] }`
- `balance`: `{ balanceAnterior, ingresoGasAtrasado, ingresosDeudasPendientes, pagoExtraordinario }`
  (funds available and the monthly income/expense relation are **computed**, not stored — derived
  live from apartments + expenses, matching the original spreadsheet's formulas)
- `reports`: payment reports residents submit — `{ id, aptId, type: "maint"|"gas", month, amount,
  note, status: "pending"|"approved"|"rejected", date }`. Approving one adds the amount into the
  apartment's `maint`/`gas` map for that month and reduces `pendingBalance`.

## Conventions
- i18n: Spanish is the default; falls back to the browser's language (`navigator.language`)
  detecting English; manual ES/EN toggle in the header. UI chrome is translated; the underlying
  financial data (expense concepts, etc.) stays in Spanish as entered.
- Currency formatting: `RD$` (Dominican peso), `Intl`-based number formatting.
- Design: stone/teal palette (Tailwind stone-*, teal-*, rose-* for negative amounts, emerald-* for
  positive), serif headings ("Source Serif 4") + sans body ("IBM Plex Sans"), loaded via a Google
  Fonts `@import`.
- Accounts: plaintext usernames/passwords stored in the data layer (not bank-grade security) — an
  explicit, disclosed trade-off for an internal building-admin tool, not a public-facing system.

## Open questions / things to revisit
- Whether residents will actually share a Claude organization with the admin (determines whether
  the published `.html` version is viable as-is, or needs a different sync approach).
- No file/photo upload for payment proof yet (reports are amount + note only).
- No password reset flow — admin sets/changes passwords manually per apartment.
