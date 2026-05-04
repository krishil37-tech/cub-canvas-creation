import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

type NavLinkRow = {
  id: string;
  label: string;
  target: string;
  sort_order: number;
  is_visible: boolean;
};

const FALLBACK: NavLinkRow[] = [
  { id: "f1", label: "Home", target: "#home", sort_order: 1, is_visible: true },
  { id: "f2", label: "About", target: "#about", sort_order: 2, is_visible: true },
  { id: "f3", label: "Programs", target: "#programs", sort_order: 3, is_visible: true },
  { id: "f4", label: "Achievements", target: "#achievements", sort_order: 4, is_visible: true },
  { id: "f5", label: "Gallery", target: "#gallery", sort_order: 5, is_visible: true },
  { id: "f6", label: "Contact", target: "#contact", sort_order: 6, is_visible: true },
];

export default function LiquidGlassNav() {
  const [links, setLinks] = useState<NavLinkRow[]>(FALLBACK);
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("nav_links")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");
      if (data && data.length) setLinks(data);
    })();
  }, []);

  // Sticky behavior: once the sentinel scrolls out of view, the nav becomes fixed.
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setStuck(!e.isIntersecting),
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-1 w-full" />
      <nav
        className={`${
          stuck ? "fixed top-3" : "relative"
        } left-0 right-0 z-40 mx-auto px-4 sm:px-6 transition-all duration-300`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="liquid-glass max-w-6xl mx-auto rounded-full pl-2 pr-2 py-2 flex items-center justify-between gap-3 animate-fade-in-up">
          {/* Logo with auto-adapting backdrop */}
          <a href="#home" className="flex items-center" aria-label="IIRA Cubs Home">
            <div className="logo-surface px-2 py-1">
              <img
                src={logo}
                alt="IIRA Cubs Pre-School"
                className="h-9 w-auto object-contain protect-media"
              />
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.id} href={l.target} className="liquid-link">
                <span>{l.label}</span>
              </a>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1">
            <a
              href="#admissions"
              className="hidden sm:inline-flex items-center justify-center bg-primary text-primary-foreground font-bold font-body px-4 py-2 rounded-full text-sm hover:brightness-110 active:scale-[0.97] transition-all shadow-md shadow-primary/20"
            >
              Apply Now
            </a>
            <ThemeToggle variant="light" />
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="lg:hidden p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden mt-2 max-w-6xl mx-auto liquid-glass rounded-2xl p-3 animate-fade-in-up">
            <div className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.target}
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground text-base font-semibold font-body py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#admissions"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center bg-primary text-primary-foreground font-bold font-body px-4 py-3 rounded-xl text-sm"
              >
                Apply Now
              </a>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer so content below doesn't jump when nav becomes fixed */}
      {stuck && <div aria-hidden className="h-20" />}
    </>
  );
}
