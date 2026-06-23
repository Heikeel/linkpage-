-- Storage: bucket avatars para fotos de perfil públicas
-- Crear el bucket desde Supabase Dashboard > Storage > New bucket
-- Nombre: avatars, Public: ON
-- Luego ejecutar estas políticas:

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
