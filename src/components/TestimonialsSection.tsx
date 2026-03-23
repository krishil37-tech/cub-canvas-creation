import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Parent of Aarav, Jr. KG",
    text: "IIRA Cubs has been a blessing for our family. Aarav looks forward to school every single day. The teachers are incredibly caring and attentive.",
  },
  {
    name: "Ravi Patel",
    role: "Parent of Anaya, Nursery",
    text: "The play-based learning approach has truly transformed Anaya's confidence. She's learned so much while having the time of her life.",
  },
  {
    name: "Meera Joshi",
    role: "Parent of Kabir, Sr. KG",
    text: "We couldn't be happier with the holistic development Kabir has shown. The school's emphasis on creativity and outdoor learning is remarkable.",
  },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="testimonials" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Testimonials</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            What Parents Say
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`bg-card rounded-2xl p-6 lg:p-8 shadow-sm shadow-foreground/5 border border-border ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="text-highlight fill-highlight" />
                ))}
              </div>
              <p className="text-foreground/80 font-body leading-relaxed italic">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold font-body text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <div className="font-bold font-body text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-body">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
