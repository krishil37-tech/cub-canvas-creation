import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Music, Brush, BookOpen, Puzzle, Leaf, Shapes } from "lucide-react";

const programs = [
  {
    icon: Shapes,
    title: "Playgroup (1.5–2.5 yrs)",
    desc: "Sensory exploration and social bonding through guided play activities.",
  },
  {
    icon: Puzzle,
    title: "Nursery (2.5–3.5 yrs)",
    desc: "Early literacy, numeracy, and motor skill development in a fun environment.",
  },
  {
    icon: BookOpen,
    title: "Jr. KG (3.5–4.5 yrs)",
    desc: "Structured learning with phonics, storytelling, and creative projects.",
  },
  {
    icon: Brush,
    title: "Sr. KG (4.5–5.5 yrs)",
    desc: "School readiness with reading, writing, math concepts, and social skills.",
  },
  {
    icon: Music,
    title: "Music & Movement",
    desc: "Rhythm, dance, and musical exploration to develop coordination and expression.",
  },
  {
    icon: Leaf,
    title: "Nature & Outdoors",
    desc: "Outdoor activities, gardening, and nature walks to connect with the environment.",
  },
];

export default function ProgramsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="programs" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Our Programs</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            What Makes Us Special
          </h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={p.title}
              className={`group bg-card rounded-2xl p-6 shadow-sm shadow-foreground/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-border hover:border-primary/20 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <p.icon size={24} className="text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-display font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
