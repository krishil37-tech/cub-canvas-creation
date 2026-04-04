import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Award, Users } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultSlides = [
  { image: hero1, title: "Building Future Leaders Since 2009", subtitle: "CBSE-aligned education from Nursery to Class X — where tradition meets modern excellence in Vadodara's most progressive school." },
  { image: hero2, title: "Where Every Child Discovers Their Potential", subtitle: "Award-winning faculty, safe campus, and holistic learning that prepares students for a confident future." },
];

const trustBadges = [
  { icon: Award, text: "Most Progressive School 2024" },
  { icon: Users, text: "1,500+ Students" },
  { icon: Shield, text: "CBSE Affiliated" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { get } = useSiteContent();

  const slides = [
    { image: hero1, title: get("hero", "slide1_title", defaultSlides[0].title), subtitle: get("hero", "slide1_subtitle", defaultSlides[0].subtitle) },
    { image: hero2, title: get("hero", "slide2_title", defaultSlides[1].title), subtitle: get("hero", "slide2_subtitle", defaultSlides[1].subtitle) },
  ];

  const ctaText = get("hero", "cta_text", "Apply for Admission →");

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="relative h-screen min-h-[600px] max-h-[920px] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/40 to-foreground/60" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding">
        <div className="max-w-4xl">
          <div className="animate-fade-in-up mb-4">
            <span className="inline-flex items-center gap-2 bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 text-primary-foreground text-xs font-bold font-body uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Admissions Open 2026-27
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground text-balance animate-fade-in-up" style={{ lineHeight: "1.08", animationDelay: "0.1s" }}>
            {slides[current].title}
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-primary-foreground/85 max-w-2xl mx-auto font-body leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {slides[current].subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="#admissions" className="btn-primary text-lg px-9 py-4 shadow-xl shadow-primary/30">
              {ctaText}
            </a>
            <a href="#about" className="inline-flex items-center gap-2 text-primary-foreground/90 font-bold font-body text-sm hover:text-primary-foreground transition-colors px-5 py-4">
              Explore Our School <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Trust badges */}
        <div className="absolute bottom-20 sm:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-3xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-primary-foreground/80 text-xs sm:text-sm font-body font-semibold">
                <badge.icon size={16} className="text-primary" />
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={prev} aria-label="Previous slide" className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-card/10 backdrop-blur-sm text-primary-foreground hover:bg-card/25 transition-all active:scale-95">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} aria-label="Next slide" className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-card/10 backdrop-blur-sm text-primary-foreground hover:bg-card/25 transition-all active:scale-95">
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-8" : "bg-primary-foreground/40 w-2 hover:bg-primary-foreground/60"}`} />
        ))}
      </div>
    </section>
  );
}
