-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- Tabla de perfiles (uno por usuario)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  name text,
  bio text,
  avatar_url text,
  accent text default '#6c63ff',
  bg text default '#f4f3ff',
  card text default '#ffffff',
  text_color text default '#1a1a2e',
  muted text default '#888888',
  icon_color text,
  theme text default 'light',
  bg_motion text default 'none',
  animation text default 'bounce',
  border_radius int default 12,
  link_gap int default 9,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de links por perfil
create table public.links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  network_id text not null,
  name text not null,
  url text default '',
  icon text not null,
  color text default '#6c63ff',
  order_index int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- RLS: cada usuario solo accede a su propio perfil y links
alter table public.profiles enable row level security;
alter table public.links enable row level security;

create policy "Usuario puede ver su propio perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Usuario puede actualizar su propio perfil"
  on public.profiles for update using (auth.uid() = id);

create policy "Usuario puede insertar su propio perfil"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Perfil público visible para todos"
  on public.profiles for select using (true);

create policy "Usuario gestiona sus links"
  on public.links for all using (
    profile_id in (select id from public.profiles where id = auth.uid())
  );

create policy "Links públicos visibles para todos"
  on public.links for select using (true);

-- Trigger para updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();
