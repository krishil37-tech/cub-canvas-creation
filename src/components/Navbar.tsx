import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-sm shadow-lg shadow-foreground/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16 lg:h-20">
        <a href="#home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm font-body">IC</span>
          </div>
          <span
            className={`font-display font-bold text-lg transition-colors ${
              scrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            IIRA Cubs
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold font-body transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#admissions"
            className="bg-primary text-primary-foreground text-sm font-bold font-body px-5 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Enroll Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-xl">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-foreground text-sm font-semibold font-body py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#admissions"
              onClick={() => setMenuOpen(false)}
              className="bg-primary text-primary-foreground text-sm font-bold font-body px-5 py-3 rounded-lg text-center mt-2"
            >
              Enroll Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
