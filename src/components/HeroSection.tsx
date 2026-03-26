import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultSlides = [
  { image: hero1, title: "Where Little Learners Grow Big Dreams", subtitle: "A nurturing preschool experience rooted in play, creativity, and love." },
  { image: hero2, title: "Learning Through Joy & Discovery", subtitle: "Hands-on activities that spark curiosity and build confident young minds." },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { get } = useSiteContent();

  const slides = [
    { image: hero1, title: get("hero", "slide1_title", defaultSlides[0].title), subtitle: get("hero", "slide1_subtitle", defaultSlides[0].subtitle) },
    { image: hero2, title: get("hero", "slide2_title", defaultSlides[1].title), subtitle: get("hero", "slide2_subtitle", defaultSlides[1].subtitle) },
  ];

  const ctaText = get("hero", "cta_text", "Enroll Now");

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section id="home" className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center section-padding">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground max-w-4xl text-balance animate-fade-in-up" style={{ lineHeight: "1.05" }}>
          {slides[current].title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-primary-foreground/90 max-w-2xl font-body animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {slides[current].subtitle}
        </p>
        <a href="#admissions" className="mt-8 bg-primary text-primary-foreground font-bold font-body px-8 py-4 rounded-xl text-lg hover:opacity-90 active:scale-[0.97] transition-all shadow-xl shadow-primary/30 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {ctaText}
        </a>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-colors active:scale-95">
        <ChevronLeft size={28} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-colors active:scale-95">
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-primary w-8" : "bg-primary-foreground/50"}`} />
        ))}
      </div>
    </section>
  );
}
