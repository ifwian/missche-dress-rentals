# Security notes

**Where the protection really is:** Postgres Row Level Security + Storage policies in `supabase/migrations/0001_init.sql`.
The `/admin` login screen only decides what to show; anyone can call the Supabase API directly, so the database rules must hold on their own.

| Who | Can |
| --- | --- |
| Anyone (anon) | Read non-archived dresses, their image rows, and availability dates. View public photo URLs. |
| Signed in, not owner | Same as anyone; read only their own `admin_profiles` row. |
| Owner (row in `admin_profiles`) | Read archived dresses; create/update/delete dresses, images, availability; upload/delete photos. |

- No customer data is stored. Inquiries open the customer's email app (mailto); nothing is sent to or kept by the site.
  The brief's `inquiries` / `bookings` tables were intentionally NOT created: unused tables that anyone can write to are attack surface. Add them (with insert-only anon RLS + rate limiting, e.g. Edge Function) only when the owner wants online inquiries.
- Availability is publicly readable on purpose; it has no names or notes.
- Double-booking is prevented in the database (exclusion constraint on `daterange`), not just in the browser.
- The anon key and URL are public by design. The `service_role` key must never be put in the repo, `VITE_` variables, or the browser.
- No sign-up UI exists; disable public sign-ups in Supabase (DEPLOYMENT.md step 1.4). Use a strong owner password; consider enabling MFA in Supabase.
- Headers (CSP, frame denial, HSTS, no-sniff) are set in `vercel.json`. `/admin` is `noindex`.
- Photos: type/size limited client-side AND by the bucket (5 MB, JPEG/PNG/WebP). Files are public by URL (needed for the site).
- Known gaps: no login rate limiting beyond Supabase's defaults; an owner who cancels a form after uploading leaves unused photos in Storage until the dress is next saved (harmless, small); `save` of images is not one transaction.
- Privacy Policy text (`src/pages/Privacy.jsx`) was drafted from how the site works; the owner should review it. Terms text is the owner's and was not altered.
