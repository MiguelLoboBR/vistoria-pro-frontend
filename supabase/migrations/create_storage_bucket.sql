
-- Create a storage bucket for inspection media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inspection-medias', 'inspection-medias', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Set up storage security policies
CREATE POLICY "Anyone can view inspection media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'inspection-medias' );

CREATE POLICY "Authenticated users can upload inspection media"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'inspection-medias' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Inspectors can update their company's inspection media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'inspection-medias' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Inspectors can delete their company's inspection media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'inspection-medias' AND
  auth.role() = 'authenticated'
);
