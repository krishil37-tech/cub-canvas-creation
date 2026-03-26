import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function AdmissionsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();

  const label = get("admissions", "label", "Admissions 2026–27");
  const title = get("admissions", "title", "Admissions Open for Playgroup – Sr. KG");
  const description = get("admissions", "description", "Give your child the gift of a joyful learning journey at IIRA Cubs Preschool. Limited seats available — enroll today.");
  const ctaText = get("admissions", "cta_text", "Apply Now");

  return (
    <section id="admissions" ref={ref} className="py-20 lg:py-28 bg-primary">
      <div className="max-w-4xl mx-auto section-padding text-center">
        <span className={`text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70 font-body ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          {label}
        </span>
        <h2 className={`mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ lineHeight: "1.1", animationDelay: "0.1s" }}>
          {title}
        </h2>
        <p className={`mt-4 text-primary-foreground/80 font-body text-lg max-w-2xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          {description}
        </p>
        <a href="#contact" className={`inline-block mt-8 bg-card text-foreground font-bold font-body px-8 py-4 rounded-xl text-lg hover:opacity-90 active:scale-[0.97] transition-all shadow-xl ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
          {ctaText}
        </a>
      </div>
    </section>
  );
}
