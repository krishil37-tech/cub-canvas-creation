import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Achievements", href: "#achievements" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-md shadow-lg shadow-foreground/5 h-16" : "bg-transparent h-18 lg:h-20"}`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-full">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <span className="text-primary-foreground font-black text-xs font-body">IC</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-display font-bold text-lg leading-tight transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
              IIRA Cubs
            </span>
            <span className={`text-[10px] font-body font-semibold uppercase tracking-wider leading-none transition-colors ${scrolled ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
              International School
            </span>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-semibold font-body transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full ${scrolled ? "text-foreground hover:text-primary" : "text-primary-foreground/90 hover:text-primary-foreground"}`}>
              {l.label}
            </a>
          ))}
          <a href="#admissions" className="btn-primary text-sm px-5 py-2.5">
            Apply Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden p-2 transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-40 animate-fade-in-up" style={{ animationDuration: "0.2s" }}>
          <div className="flex flex-col p-5 gap-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-foreground text-base font-semibold font-body py-3.5 px-4 rounded-xl hover:bg-secondary transition-colors">
                {l.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <a href="#admissions" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center py-4">
                Apply Now
              </a>
              <a href="tel:+912652650000" className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-body font-semibold mt-3 py-3">
                <Phone size={16} /> Call: +91 265-2650XXX
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
