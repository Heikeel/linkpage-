-- Fix crítico: la columna paypal_email era legible por CUALQUIERA via la anon key pública.
-- Postgres RLS es row-level, no column-level, así que la política using(true) de profiles
-- expone todas las columnas. La feature de tienda/PayPal fue eliminada, así que se quita la
-- columna de raíz (elimina el leak en el origen, no hay que ocultarla).

ALTER TABLE public.profiles DROP COLUMN IF EXISTS paypal_email;

-- store_terms_accepted_at también pertenecía a la tienda eliminada
ALTER TABLE public.profiles DROP COLUMN IF EXISTS store_terms_accepted_at;
