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

const iconMap: Record<string, React.ElementType> = { Trophy, Award, Star, Medal, Crown, Shield, Target, Zap, GraduationCap };
function getIcon(name: string) { return iconMap[name] || Trophy; }

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
    <section id="achievements" ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>
            {get("achievements", "section_label", "Our Achievements")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            {get("achievements", "section_title", "A Tradition of Excellence")}
          </h2>
          <p className={`section-subtitle ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
            Our commitment to excellence has been recognized at state and national levels.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className={`card-elevated group ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <span className="text-xs font-extrabold font-body text-primary bg-primary/10 px-3 py-1 rounded-full">{item.year}</span>
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
