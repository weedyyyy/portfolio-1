-- Run this in your Supabase SQL editor to set up storage for project images

-- Create the bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Public Access for project images" ON storage.objects
FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their uploaded project images" ON storage.objects
FOR UPDATE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their uploaded project images" ON storage.objects
FOR DELETE USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');
