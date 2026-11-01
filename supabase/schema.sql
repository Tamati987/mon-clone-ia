-- Coffre-fort de Mon Clone IA (projet Supabase PulseConnect, schéma clone_ia)
create schema if not exists clone_ia;
create table if not exists clone_ia.profil (id text primary key default 'main', consignes text, stats jsonb default '{}'::jsonb, updated_at timestamptz default now());
create table if not exists clone_ia.notes (id text primary key, source text not null, texte text not null, ajoute_le timestamptz);
create table if not exists clone_ia.conversations (id text primary key, titre text, cree_le timestamptz, maj_le timestamptz, messages jsonb not null default '[]'::jsonb);
create table if not exists clone_ia.syncs (id bigint generated always as identity primary key, fait_le timestamptz default now(), bilan jsonb);
alter table clone_ia.profil enable row level security;
alter table clone_ia.notes enable row level security;
alter table clone_ia.conversations enable row level security;
alter table clone_ia.syncs enable row level security;
revoke all on schema clone_ia from anon, authenticated;
revoke all on all tables in schema clone_ia from anon, authenticated;
