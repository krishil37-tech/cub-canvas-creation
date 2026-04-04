import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useEffect, useRef, useState } from "react";

const defaultStats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "1,500+", label: "Students & Growing" },
  { value: "100%", label: "Parent Satisfaction" },
  { value: "25+", label: "Awards & Recognitions" },
];

function AnimatedNumber({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const numMatch = target.match(/[\d,]+/);
        if (!numMatch) { setDisplay(target); return; }
        const num = parseInt(numMatch[0].replace(/,/g, ""));
        const prefix = target.slice(0, target.indexOf(numMatch[0]));
        const sfx = target.slice(target.indexOf(numMatch[0]) + numMatch[0].length);
        const duration = 1500;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * num);
          setDisplay(`${prefix}${current.toLocaleString()}${sfx}`);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsBar() {
  const { ref, isVisible } = useScrollReveal(0.3);
  const { get, getJSON } = useSiteContent();

  const tagline = get("stats", "tagline", "Trusted by 1,500+ students and 1,000+ parents — building a strong foundation since 2009.");
  const stats = getJSON<typeof defaultStats>("stats", "items", defaultStats);

  return (
    <section ref={ref} className="relative bg-card py-12 lg:py-16 border-y border-border">
      <div className="max-w-6xl mx-auto section-padding">
        <p className={`text-center text-muted-foreground font-body text-sm max-w-xl mx-auto mb-10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {tagline}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center relative ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl lg:text-4xl font-display font-bold text-primary">
                <AnimatedNumber target={s.value} />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-body font-semibold mt-1.5">{s.label}</div>
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
