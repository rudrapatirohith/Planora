-- ============================================================
-- Planora — Storage Buckets Migration
-- Run AFTER 002_rls_policies.sql
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('receipts',    'receipts',    FALSE, 10485760,
   ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']),
  ('trip-covers', 'trip-covers', TRUE,  5242880,
   ARRAY['image/jpeg','image/png','image/webp']),
  ('documents',   'documents',   FALSE, 20971520,
   ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------
-- RECEIPTS bucket policies
-- --------------------------------------------------------
CREATE POLICY "Users upload own receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users view own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own receipts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- --------------------------------------------------------
-- TRIP COVERS bucket policies (public read)
-- --------------------------------------------------------
CREATE POLICY "Public view trip covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trip-covers');

CREATE POLICY "Users upload trip covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'trip-covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own trip covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'trip-covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- --------------------------------------------------------
-- DOCUMENTS bucket policies
-- --------------------------------------------------------
CREATE POLICY "Users upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
