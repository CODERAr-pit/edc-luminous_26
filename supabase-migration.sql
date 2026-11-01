-- Run this in your Supabase SQL editor (Database → SQL Editor → New Query)
-- to create or update the registrations table for LUMINOUS 10.0

create table if not exists public.luminous_registrations (
  id              uuid primary key default gen_random_uuid(),
  team_name       text not null,
  team_leader     text not null,
  team_leader_reg_no text not null default '',
  team_leader_email text not null,
  team_leader_whatsapp text not null,
  member1_name    text not null,
  member1_number  text not null,
  member2_name    text not null,
  member2_number  text not null,
  member3_name    text not null,
  member3_number  text not null,
  payment_screenshot_path text not null,
  submitted_at    timestamptz not null default now()
);

-- Backfill projects where this field was added after the table was originally
-- created. Existing rows receive an empty value; new registrations write the
-- submitted team leader registration number.
alter table public.luminous_registrations
  add column if not exists team_leader_reg_no text not null default '';

-- Allow optional team members 3 and 4 to be null/empty
alter table public.luminous_registrations
  alter column member2_name drop not null,
  alter column member2_number drop not null,
  alter column member3_name drop not null,
  alter column member3_number drop not null;

-- Enable Row Level Security
alter table public.luminous_registrations enable row level security;

-- Make this migration safe to run again after a partial or previous setup.
drop policy if exists "Allow anon insert" on public.luminous_registrations;
drop policy if exists "Allow authenticated select" on public.luminous_registrations;

-- Allow inserts from anon (public registration form)
create policy "Allow anon insert"
  on public.luminous_registrations
  for insert
  to anon
  with check (true);

-- Allow authenticated users (admins) to read all rows
create policy "Allow authenticated select"
  on public.luminous_registrations
  for select
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'payment-screenshots';

drop policy if exists "Allow anon payment screenshot uploads" on storage.objects;
drop policy if exists "Allow authenticated payment screenshot reads" on storage.objects;

create policy "Allow anon payment screenshot uploads"
  on storage.objects for insert to anon
  with check (bucket_id = 'payment-screenshots');

create policy "Allow authenticated payment screenshot reads"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-screenshots');
