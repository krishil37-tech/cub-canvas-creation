import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-react";

type SocialLink = { id: string; platform: string; url: string };

const platformIcons: Record<string, React.ElementType> = {
  Facebook, Instagram, Twitter, YouTube: Youtube, LinkedIn: Linkedin, Website: Globe,
};

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data) setSocials(data);
    });
  }, []);

  return (
    <footer className="bg-foreground text-primary-foreground/70 py-10">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs font-body">IC</span>
            </div>
            <span className="font-display font-bold text-primary-foreground">IIRA Cubs Preschool</span>
          </div>
          <p className="text-sm font-body text-center">
            © {new Date().getFullYear()} IIRA Cubs Preschool. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socials.length > 0 ? socials.map((s) => {
              const Icon = platformIcons[s.platform] || Globe;
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors" aria-label={s.platform}>
                  <Icon size={20} />
                </a>
              );
            }) : (
              ["Privacy", "Terms", "Sitemap"].map((l) => (
                <a key={l} href="#" className="text-sm font-body hover:text-primary-foreground transition-colors">{l}</a>
              ))
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
