# Karla-Project — Residencial Karla IX Portal

A bilingual (Spanish/English) building-management web app for a residential complex, with two portals:

- **Admin**: manage apartment/resident accounts, record maintenance and propane-gas income, track expenses, view the financial statement, and approve payment reports.
- **Resident**: view their own payment history and pending balance, and submit payment reports.

## Files

| File | What it is |
|---|---|
| `residencial-karla-ix.html` | Standalone version — React 18 + Babel Standalone + Tailwind from CDNs, no build step. Open in a browser. |
| `residencial_karla_ix.jsx` | React component version (uses `lucide-react` and `recharts`). |
| `proyecto-residencial-karla-ix.md` | Project notes: architecture, data model, conventions, open questions. |

## Sample data

All figures in this repo are **sample data** for demonstration — no real building finances are included.
Default passwords are set to `CHANGE_ME`; set real ones before using the app.

## Stack

React 18 · Tailwind CSS · currency formatted as RD$ (Dominican peso).
