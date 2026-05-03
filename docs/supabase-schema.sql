-- Schéma minimal Supabase pour le workflow "gestion des litiges"
-- À exécuter dans Supabase SQL Editor.

-- Recommandé pour générer des UUID automatiquement
create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  telegram_chat_id bigint unique,
  name text,
  email text,
  tier text not null default 'standard' check (tier in ('standard', 'premium')),
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  correlation_id text,
  chat_id bigint,
  category text not null default 'other',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  action text not null check (action in ('auto_reply', 'escalate')),
  message text,
  reply text,
  reasoning_summary text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tickets_chat_id_created_at
  on public.tickets (chat_id, created_at desc);
