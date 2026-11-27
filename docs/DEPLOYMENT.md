# Deployment: Supabase + Vercel (do these in order)

Nothing here has been run against a real Supabase project yet (no credentials were available).
The SQL and services were reviewed and the UI was tested against a mocked API only. Test each step.

## 1. Supabase
1. Create a project at supabase.com (free plan is fine).
2. SQL Editor: paste and run `supabase/migrations/0001_init.sql`. If it errors, fix it before going on.
3. Authentication > Users > **Add user**: the owner's email + a strong password, tick **Auto Confirm User**.
4. Authentication > Sign In / Providers: **turn OFF "Allow new users to sign up"** (owner accounts are created by hand).
5. SQL Editor: edit the email in `supabase/seed_owner.sql` and run it (this makes that user an owner).
6. Project Settings > API: copy the **Project URL** and the **anon public** key. Never copy the `service_role` key anywhere.
7. Optional: Authentication > URL Configuration: set Site URL to the Vercel address after step 2 below.

## 2. Vercel
1. Push the project to GitHub, then Vercel > Add New Project > import it. Framework: Vite (auto).
2. Environment Variables (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_OWNER_EMAIL` (the owner's real address, when supplied).
3. Deploy. `vercel.json` already has the SPA rewrite and security headers.
4. Open `/admin`, sign in, add a dress with photos, block a date, then open the public site in a private window to confirm customers see it.

## 3. Check after deploying
- `/admin` while signed out goes to `/admin/login`; `/dashboard` redirects to `/admin`.
- A second Supabase account that is NOT in `admin_profiles` sees "not an owner account" and cannot write (try it).
- Overlapping rentals for one dress are refused; "make available" splits a period correctly.
- Photos upload, show publicly, and disappear from Storage when removed from a dress.
- The CSP in `vercel.json` allows `https://*.supabase.co`; if you use a custom Supabase domain, add it.
