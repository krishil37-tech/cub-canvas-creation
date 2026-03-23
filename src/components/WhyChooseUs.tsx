import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Heart, BookOpen, Shield, Palette, Users, Award } from "lucide-react";
import whyChoose from "@/assets/why-choose.jpg";

const reasons = [
  { icon: Heart, text: "Warm & Caring Environment" },
  { icon: BookOpen, text: "Play-Based Learning Curriculum" },
  { icon: Shield, text: "Safe & Secure Campus" },
  { icon: Palette, text: "Creative Arts & Expression" },
  { icon: Users, text: "Low Student-Teacher Ratio" },
  { icon: Award, text: "Award-Winning Preschool" },
];

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={isVisible ? "animate-fade-in-left" : "opacity-0"}>
            <div className="relative">
              <img
                src={whyChoose}
                alt="IIRA Cubs Preschool campus"
                className="rounded-2xl shadow-2xl shadow-foreground/10 w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-xl px-5 py-3 shadow-lg font-body font-bold text-lg">
                10+ Years of Trust
              </div>
            </div>
          </div>

          <div className={isVisible ? "animate-fade-in-right" : "opacity-0"} style={{ animationDelay: "0.15s" }}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title mt-3">More Than a Preschool</h2>
            <p className="mt-4 text-muted-foreground font-body leading-relaxed max-w-lg">
              At IIRA Cubs, we believe every child is unique. Our nurturing environment encourages exploration,
              creativity, and social skills through carefully designed play-based learning experiences.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {reasons.map((r, i) => (
                <div
                  key={r.text}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm shadow-foreground/5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <r.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold font-body text-foreground">{r.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
