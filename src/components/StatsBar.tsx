import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultStats = [
  { value: "10+", label: "Years of Excellence" },
  { value: "500+", label: "Happy Children" },
  { value: "100%", label: "Parent Satisfaction" },
  { value: "25+", label: "Awards Won" },
];

export default function StatsBar() {
  const { ref, isVisible } = useScrollReveal(0.3);
  const { get, getJSON } = useSiteContent();

  const tagline = get("stats", "tagline", "Trusted by 500+ families — nurturing young minds since 2014.");
  const stats = getJSON<typeof defaultStats>("stats", "items", defaultStats);

  return (
    <section ref={ref} className="bg-card border-y border-border py-10 lg:py-14">
      <div className="max-w-6xl mx-auto section-padding">
        <p className="text-center text-muted-foreground font-body text-sm mb-8">{tagline}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl lg:text-4xl font-display font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground font-body mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
