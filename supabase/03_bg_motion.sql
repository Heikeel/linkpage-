-- Ejecuta esto en el SQL Editor de Supabase para añadir el fondo animado opcional.

alter table public.profiles add column if not exists bg_motion text default 'none';
