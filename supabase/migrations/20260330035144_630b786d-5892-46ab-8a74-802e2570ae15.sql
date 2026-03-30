
-- Add unique constraint for site_content upsert support
CREATE UNIQUE INDEX IF NOT EXISTS site_content_section_key_idx ON public.site_content (section, key);

-- Add photo columns to testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS photo_path text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS photo_position text DEFAULT 'center';

-- Create site-documents bucket for downloadable files
INSERT INTO storage.buckets (id, name, public) VALUES ('site-documents', 'site-documents', true);

CREATE POLICY "Public read documents" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-documents');
CREATE POLICY "Admin upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-documents' AND public.has_role(auth.uid(), 'admin'));

-- specialties table
CREATE TABLE public.specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'BookOpen',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage specialties" ON public.specialties FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible specialties" ON public.specialties FOR SELECT TO anon, authenticated USING (is_visible = true);

-- achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Trophy',
  year text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (is_visible = true);

-- events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible events" ON public.events FOR SELECT TO anon, authenticated USING (is_visible = true);

-- leadership_members table
CREATE TABLE public.leadership_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  photo_path text,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leadership_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage leadership" ON public.leadership_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible leadership" ON public.leadership_members FOR SELECT TO anon, authenticated USING (is_visible = true);

-- educators table
CREATE TABLE public.educators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  photo_path text,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.educators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage educators" ON public.educators FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible educators" ON public.educators FOR SELECT TO anon, authenticated USING (is_visible = true);

-- blogs table
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'Student',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage blogs" ON public.blogs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (is_visible = true);

-- resources table
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_path text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible resources" ON public.resources FOR SELECT TO anon, authenticated USING (is_visible = true);

-- faq_items table
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage faq" ON public.faq_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible faq" ON public.faq_items FOR SELECT TO anon, authenticated USING (is_visible = true);

-- social_links table
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage social links" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view visible social links" ON public.social_links FOR SELECT TO anon, authenticated USING (is_visible = true);
