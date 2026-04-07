import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Heart, BookOpen, Shield, Palette, Users, Award, Check } from "lucide-react";
import whyChoose from "@/assets/why-choose.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconList = [Heart, BookOpen, Shield, Palette, Users, Award];
const defaultReasons = [
  { text: "Experienced & Dedicated Faculty" },
  { text: "CBSE Curriculum with Holistic Approach" },
  { text: "Stress-Free Learning Environment" },
  { text: "Strong Co-Curricular Programs" },
  { text: "Safe & Inclusive Campus" },
  { text: "Award-Winning Most Progressive School" },
];

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal();
  const { get, getJSON } = useSiteContent();

  const sectionLabel = get("about", "section_label", "Why Choose Us");
  const sectionTitle = get("about", "section_title", "More Than a School");
  const description = get("about", "description", "The IIRA International School Vadodara is about the spirit, morals and ethics of India. A revolutionary, futuristic and tranquil institution nurtures an ideal educational environment. A blend of tradition and modernity, this institution imparts a natural impetus towards excellence in all spheres of life.");
  const badgeText = get("about", "badge_text", "15+ Years of Trust");
  const reasons = getJSON<typeof defaultReasons>("about", "reasons", defaultReasons);

  return (
    <section id="about" ref={ref} className="py-20 lg:py-28 bg-warm overflow-hidden">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={isVisible ? "animate-fade-in-left" : ""}>
            <div className="relative">
              <img src={whyChoose} alt="IIRA International School campus" className="rounded-2xl shadow-2xl shadow-foreground/10 w-full object-cover aspect-[4/3]" loading="lazy" />
              <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-primary text-primary-foreground rounded-xl px-5 py-3 shadow-xl shadow-primary/25 font-body font-bold text-base animate-float">
                🏆 {badgeText}
              </div>
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-accent text-accent-foreground rounded-xl px-4 py-2 shadow-lg font-body font-bold text-sm animate-float" style={{ animationDelay: "1.5s" }}>
                ⭐ CBSE Affiliated
              </div>
            </div>
          </div>

          <div className={isVisible ? "animate-fade-in-right" : ""} style={{ animationDelay: "0.15s" }}>
            <span className="section-label">{sectionLabel}</span>
            <h2 className="section-title mt-3">{sectionTitle}</h2>
            <p className="mt-5 text-muted-foreground font-body leading-relaxed max-w-lg text-[15px]">{description}</p>

            <div className="mt-8 space-y-3">
              {reasons.map((r, i) => {
                const Icon = iconList[i % iconList.length];
                return (
                  <div key={r.text} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Check size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold font-body text-foreground">{r.text}</span>
                  </div>
                );
              })}
            </div>

            <a href="#admissions" className="btn-primary mt-8 inline-flex">
              Start Your Child's Journey →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
