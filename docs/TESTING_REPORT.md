# Testing report (2026-11-27)

Environment: Node 20, Vite 6.4, Playwright Chromium. Fonts blocked in the sandbox (fallback fonts used); the only console errors were those blocked font requests.

PASSED
- `npm install` and `npm run build`: success (no warnings that block).
- Horizontal overflow check at 320, 360, 375, 390, 430, 768 and 1280 px on 13 routes: /, /collection, /inquiries, /signin, /account, /faqs and all 7 /admin pages. None overflowed.
- Admin (local demo, dev server) at 390 px: all 7 pages render with correct headings; mobile drawer opens and closes with Escape; archive opens a confirmation dialog, Cancel closes it, confirming archives and shows a success toast; no page errors.
- Admin desktop screenshot reviewed (sidebar, header, breadcrumbs, overview).

NOT TESTED (needs a real Supabase project, which this environment does not have)
- Customer email code sign-in and /account listing; submitting an inquiry to the database; owner status changes; confirming a booking creating a reserved date; RLS rules in `0001` and `0002`; image upload to Storage; a production deployment.
- Real mail app, screen readers, real phones, keyboard-only pass of every dialog, contrast measurement tool.
- The /admin pages in a built (production) bundle without Supabase show "not set up" by design.

KNOWN GAPS
- No real Missche photos (Facebook blocks automated access; owner must supply them).
- Add/Edit dress is still a full page (`/admin/dresses/new`, `/:id/edit`), not a dialog. Photo deletion in the uploader has no confirmation dialog yet.
- Categories page is read-only (categories are assigned per dress).
- Settings page is read-only (values come from Vercel environment variables).
- Magic UI effects beyond the existing BlurFade were not added.
