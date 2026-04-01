import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award, Star, Medal, Crown, Shield, Target, Zap, GraduationCap } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

type Achievement = { id: string; icon: string; year: string; title: string; description: string };

const defaults: Achievement[] = [
  { id: "1", icon: "Trophy", year: "2024", title: "Most Progressive School", description: "Recognized with the \"Most Progressive School of the Year 2024\" award by The Times of India (Times Group)." },
  { id: "2", icon: "Award", year: "2023", title: "Excellence in Education", description: "Awarded for academic excellence and innovative teaching methodologies." },
];

function getIcon(name: string) {
  const Icon = (LucideIcons as Record<string, React.ElementType>)[name];
  return Icon || LucideIcons.Trophy;
}

export default function AchievementsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [items, setItems] = useState<Achievement[]>(defaults);

  useEffect(() => {
    supabase.from("achievements").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setItems(data);
    });
  }, []);

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {get("achievements", "section_label", "Our Achievements")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            {get("achievements", "section_title", "A Tradition of Excellence")}
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className={`bg-card rounded-2xl p-6 shadow-sm shadow-foreground/5 border border-border ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold font-body text-muted-foreground bg-secondary px-3 py-1 rounded-full">{item.year}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
