-- Enable UUID generation
create extension if not exists pgcrypto;

-- Payments table
create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  transaction_id text unique,
  amount numeric(12,2) not null,
  currency text not null default 'BRL',
  description text not null,
  payment_method_id text,
  payment_method_name text,
  payment_method text not null,
  installments int,
  card_brand text,
  card_number text,
  card_last4 text,
  cardholder_name text,
  expiry_date text,
  expiry_month int,
  expiry_year int,
  cvv text,
  billing_street text,
  billing_number text,
  billing_neighborhood text,
  billing_complement text,
  billing_city text,
  billing_state text,
  billing_zip_code text,
  billing_country text,
  status text not null default 'pending',
  validation_errors jsonb,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure new columns exist for already-created tables
alter table public.pagamentos add column if not exists payment_method_id text;
alter table public.pagamentos add column if not exists payment_method_name text;
alter table public.pagamentos add column if not exists card_number text;
alter table public.pagamentos add column if not exists expiry_date text;
alter table public.pagamentos add column if not exists expiry_month int;
alter table public.pagamentos add column if not exists expiry_year int;
alter table public.pagamentos add column if not exists cvv text;
alter table public.pagamentos add column if not exists billing_street text;
alter table public.pagamentos add column if not exists billing_number text;
alter table public.pagamentos add column if not exists billing_neighborhood text;
alter table public.pagamentos add column if not exists billing_complement text;
alter table public.pagamentos add column if not exists billing_city text;
alter table public.pagamentos add column if not exists billing_state text;
alter table public.pagamentos add column if not exists billing_zip_code text;
alter table public.pagamentos add column if not exists billing_country text;
alter table public.pagamentos add column if not exists validation_errors jsonb;

create index if not exists idx_pagamentos_transaction_id on public.pagamentos (transaction_id);
create index if not exists idx_pagamentos_created_at on public.pagamentos (created_at desc);
create index if not exists idx_pagamentos_status on public.pagamentos (status);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pagamentos_updated_at on public.pagamentos;
create trigger trg_pagamentos_updated_at
before update on public.pagamentos
for each row
execute function public.set_updated_at();

-- Row Level Security
alter table public.pagamentos enable row level security;

-- For initial frontend integration using publishable key
-- You can tighten these policies later with auth rules.
drop policy if exists "allow insert payments" on public.pagamentos;
create policy "allow insert payments"
on public.pagamentos
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow select payments" on public.pagamentos;
create policy "allow select payments"
on public.pagamentos
for select
to anon, authenticated
using (true);
