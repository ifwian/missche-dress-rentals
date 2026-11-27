-- Run AFTER creating the owner in Supabase: Authentication > Users > Add user (email + password,
-- tick "Auto Confirm User"). Replace the email below, then run this in the SQL editor.
insert into public.admin_profiles (user_id)
select id from auth.users where email = 'OWNER_EMAIL_HERE'
on conflict do nothing;
