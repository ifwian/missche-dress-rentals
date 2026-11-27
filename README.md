# Missche Dress Rentals

A dress rental catalog website for Missche Dress Rentals, Brgy. Bañadero, Calamba, Laguna.
**Status: customer site redesigned; Supabase backend, owner login (`/admin`) and Vercel config are written but NOT yet tested against a real Supabase project.** `npm install` and `npm run build` pass. Follow `docs/DEPLOYMENT.md` to go live.

## Run it on your computer
1. Install [Node.js](https://nodejs.org) (LTS version).
2. Unzip the project and open the folder in VS Code.
3. In the VS Code terminal:

```bash
npm install
npm run dev
```

4. Open the address shown (usually http://localhost:5173).

To make a production build: `npm run build`, then `npm run preview`.
After the first `npm install`, commit the new `package-lock.json`.

## Set the owner's email
Copy `.env.example` to `.env`, fill in `VITE_OWNER_EMAIL=`, and restart `npm run dev`.
While it is empty (or not a valid address), visitors can copy their inquiry and send it through the Facebook page. The address is public once the site is published.

## Change content
| What | Where |
| --- | --- |
| Business details, links, occasions, campaign/editorial photos | `src/config/business.js` |
| Terms & Conditions / FAQs | `src/content/terms.js`, `src/content/faqs.js` |
| Privacy Policy | `src/pages/Privacy.jsx` (owner should review) |
| Colours, fonts, shadows | `src/index.css` |
| Sample dresses | `src/data/dresses.js` (or edit in the dashboard) |
| Sample reserved/unavailable dates | `src/data/availability.js` |
| Campaign photos | put real photos in `public/images/campaign/`, list them in `campaignImages` |
| Dress photos | upload in the owner dashboard (no placeholder pictures are shipped) |

All dresses, prices, sizes, measurements, dates and pictures shown now are **samples**, not real inventory.

## What works now
- Home (campaign hero, featured carousel, occasions, process), About, Contact, FAQs, Terms, Privacy, floating help button, mobile navigation
- Inquiries page: schedule calculator, review step, email/copy (an inquiry is never a booking)
- Collection: search, category filters, sorting, availability for a chosen date
- Dress pages: photo gallery, details, availability calendar, inquiry by email app or copied text
- Owner dashboard (below)

## Owner dashboard (local demo)
Open `/admin` by typing the address (it is not linked publicly). With no Supabase keys it is a local demo (development only, no login); a published build without keys blocks it. With Supabase keys it requires owner login.
- **Overview:** totals for today and recently updated dresses
- **Dresses:** add, edit, archive and restore; up to 6 photos each; price, sizes, colour, categories, measurements
- **Availability:** pick a dress, tap a start and end date, then mark a rental, block dates, or make them available; or mark it temporarily unavailable
- **Reset demo data** deletes everything saved and brings back the samples

**There is no login, and everything is saved only in the browser you use.** Visitors on other devices see only the samples.
Browser storage is small (roughly a few dozen photos) and clearing site data erases it, so keep your original photos.
Do not rely on it for real bookings.

## Needs a future backend
Shared availability across devices, a real database, image uploads that everyone can see, and owner login.
This prototype uses `localStorage`, which stays in one browser and is not real-time or multi-user. See `docs/BACKEND.md`.

## Publishing the site
The pages use browser routing, so the host must serve `index.html` for unknown paths (a "single-page app" rewrite).
`public/_redirects` does this on Netlify; other hosts need their own setting. Hosting has not been tested.

## Going live (Supabase + Vercel)
See `docs/DEPLOYMENT.md` (steps) and `docs/SECURITY.md` (what is protected and how). Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).


## Routes
Customer: `/`, `/collection`, `/collection/:id`, `/inquiries`, `/signin` (email code), `/account`, `/faqs`, `/terms`, `/privacy`.
Owner (separate login, protected by Supabase Auth + Row Level Security): `/admin/login`, `/admin`, `/admin/dresses`, `/admin/categories`, `/admin/availability`, `/admin/inquiries`, `/admin/bookings`, `/admin/settings`.

## Environment variables
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_OWNER_EMAIL`, `VITE_TIKTOK_URL` (see `.env.example`). Never put a service_role key in the frontend.

## Database
Run `supabase/migrations/0001_init.sql` then `0002_customer_inquiries.sql`. Enable the Email auth provider and add `{{ .Token }}` to the Magic Link / OTP email template so customers receive a code. See `docs/DEPLOYMENT.md` and `docs/TESTING_REPORT.md`.
