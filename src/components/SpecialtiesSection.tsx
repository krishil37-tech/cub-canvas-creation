import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, Heart, Star, Shield, Palette, Music, Leaf, Puzzle, Shapes, GraduationCap, Globe, Lightbulb, Target, Zap, Award, Trophy } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

type Specialty = { id: string; icon: string; title: string; description: string; sort_order: number };

const defaultSpecialties = [
  { id: "1", icon: "BookOpen", title: "CBSE Curriculum", description: "Comprehensive CBSE-aligned curriculum from Nursery to Class X with a focus on conceptual and experiential learning.", sort_order: 0 },
  { id: "2", icon: "Users", title: "Experienced Faculty", description: "Dedicated and trained educators who bring passion and innovation to every classroom.", sort_order: 1 },
  { id: "3", icon: "Heart", title: "Stress-Free Learning", description: "A nurturing environment that promotes joyful, pressure-free education.", sort_order: 2 },
];

const iconMap: Record<string, React.ElementType> = { BookOpen, Users, Heart, Star, Shield, Palette, Music, Leaf, Puzzle, Shapes, GraduationCap, Globe, Lightbulb, Target, Zap, Award, Trophy };
function getIcon(name: string) { return iconMap[name] || Star; }

export default function SpecialtiesSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [items, setItems] = useState<Specialty[]>(defaultSpecialties);

  useEffect(() => {
    supabase.from("specialties").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setItems(data);
    });
  }, []);

  return (
    <section id="programs" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {get("specialties", "section_label", "Our Specialties")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            {get("specialties", "section_title", "What Makes Us Special")}
          </h2>
          <p className={`section-subtitle ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
            Everything we do is designed to unlock your child's full potential in a safe, inspiring environment.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.id} className={`card-elevated ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-display font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
