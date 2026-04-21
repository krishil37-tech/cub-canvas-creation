CREATE TABLE public.chatbot_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  event_type TEXT NOT NULL DEFAULT 'opened',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log engagement"
  ON public.chatbot_engagements
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view engagements"
  ON public.chatbot_engagements
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete engagements"
  ON public.chatbot_engagements
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));