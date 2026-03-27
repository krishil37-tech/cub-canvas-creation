
-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Create gallery_images table to track gallery entries
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible gallery images
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
  FOR SELECT TO anon, authenticated
  USING (is_visible = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage gallery images
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Storage RLS: anyone can view files
CREATE POLICY "Anyone can view site images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-images');

-- Admins can upload
CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete site images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));
