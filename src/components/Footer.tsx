import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

type SocialLink = { id: string; platform: string; url: string };

const platformIcons: Record<string, React.ElementType> = {
  Facebook, Instagram, Twitter, YouTube: Youtube, LinkedIn: Linkedin, Website: Globe,
};

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const { get } = useSiteContent();

  const address = get("contact", "address", "Next to Siddheshwar Krishna, Near Earth Allyssum, Bhaili, Vadodara, Gujarat");
  const phone = get("contact", "phone", "+91 265-2650XXX");
  const email = get("contact", "email", "info@iira.co.in");

  useEffect(() => {
    supabase.from("social_links").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data) setSocials(data);
    });
  }, []);

  return (
    <footer className="bg-foreground text-primary-foreground/70 relative">
      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:brightness-110 transition-all active:scale-95" aria-label="Back to top">
        <ArrowUp size={18} />
      </button>

      <div className="max-w-7xl mx-auto section-padding pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xs font-body">IC</span>
              </div>
              <div>
                <span className="font-display font-bold text-primary-foreground text-lg block leading-tight">IIRA Cubs</span>
                <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-primary-foreground/40">International School</span>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed max-w-xs">
              Building future leaders through a blend of tradition, innovation, and holistic education since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-bold text-primary-foreground text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm font-body hover:text-primary-foreground hover:pl-1 transition-all">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-bold text-primary-foreground text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm font-body">
                <MapPin size={15} className="flex-shrink-0 mt-0.5 text-primary" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body">
                <Phone size={15} className="flex-shrink-0 text-primary" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-primary-foreground transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2 text-sm font-body">
                <Mail size={15} className="flex-shrink-0 text-primary" />
                <a href={`mailto:${email}`} className="hover:text-primary-foreground transition-colors">{email}</a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-body font-bold text-primary-foreground text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5">
              {socials.length > 0 ? socials.map((s) => {
                const Icon = platformIcons[s.platform] || Globe;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all" aria-label={s.platform}>
                    <Icon size={18} />
                  </a>
                );
              }) : (
                <p className="text-sm font-body">Coming soon</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-center sm:text-left">
            © {new Date().getFullYear()} IIRA International School. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs font-body hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-body hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
