CREATE TABLE public.nav_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '#',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible nav links"
ON public.nav_links FOR SELECT
TO anon, authenticated
USING (is_visible = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage nav links"
ON public.nav_links FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.nav_links (label, target, sort_order) VALUES
  ('Home', '#home', 1),
  ('About', '#about', 2),
  ('Programs', '#programs', 3),
  ('Achievements', '#achievements', 4),
  ('Gallery', '#gallery', 5),
  ('Contact', '#contact', 6);