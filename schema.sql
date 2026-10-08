-- IOI Tracker — Supabase veritabanı şeması
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run

create table if not exists public.sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day         date not null,
  line        text not null check (line in ('C','M','G','A','T','D','K','S')),
  topic       text,
  minutes     integer not null check (minutes between 0 and 1440),
  correct     integer check (correct >= 0),
  wrong       integer check (wrong >= 0),
  total       integer check (total >= 0),
  exam_code   text,
  err         jsonb not null default '{}'::jsonb,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists sessions_user_day on public.sessions (user_id, day);

create table if not exists public.topic_status (
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  code        text not null,
  status      text not null check (status in ('todo','doing','done')),
  updated_at  timestamptz not null default now(),
  primary key (user_id, code)
);

-- Satır düzeyi güvenlik: herkes sadece kendi satırlarını görür ve değiştirir
alter table public.sessions enable row level security;
alter table public.topic_status enable row level security;

drop policy if exists "sessions_select_own" on public.sessions;
drop policy if exists "sessions_insert_own" on public.sessions;
drop policy if exists "sessions_update_own" on public.sessions;
drop policy if exists "sessions_delete_own" on public.sessions;
create policy "sessions_select_own" on public.sessions for select to authenticated using ((select auth.uid()) = user_id);
create policy "sessions_insert_own" on public.sessions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "sessions_update_own" on public.sessions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "sessions_delete_own" on public.sessions for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "topics_select_own" on public.topic_status;
drop policy if exists "topics_insert_own" on public.topic_status;
drop policy if exists "topics_update_own" on public.topic_status;
drop policy if exists "topics_delete_own" on public.topic_status;
create policy "topics_select_own" on public.topic_status for select to authenticated using ((select auth.uid()) = user_id);
create policy "topics_insert_own" on public.topic_status for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "topics_update_own" on public.topic_status for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "topics_delete_own" on public.topic_status for delete to authenticated using ((select auth.uid()) = user_id);
