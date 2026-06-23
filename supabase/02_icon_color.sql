-- Ejecuta esto en el SQL Editor de Supabase para añadir el color de logos opcional.
-- (theme ya existe si lo agregaste antes; el IF NOT EXISTS lo deja pasar sin error)

alter table public.profiles add column if not exists icon_color text;
alter table public.profiles add column if not exists theme text default 'light';
