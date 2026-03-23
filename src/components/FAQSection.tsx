import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What age groups do you accept?",
    a: "We accept children from 1.5 years to 5.5 years across our Playgroup, Nursery, Jr. KG, and Sr. KG programs.",
  },
  {
    q: "What is the student-teacher ratio?",
    a: "We maintain a low 10:1 student-teacher ratio to ensure personalized attention for every child.",
  },
  {
    q: "What curriculum do you follow?",
    a: "We follow a play-based learning curriculum that integrates early literacy, numeracy, arts, music, and outdoor exploration.",
  },
  {
    q: "What are the school timings?",
    a: "Playgroup: 9:00 AM – 11:30 AM. Nursery to Sr. KG: 8:30 AM – 12:30 PM. Extended daycare available until 4:00 PM.",
  },
  {
    q: "Is transportation available?",
    a: "Yes, we offer safe and supervised bus transportation covering major areas in Vadodara.",
  },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto section-padding">
        <div className="text-center">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>FAQ</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className={`mt-12 space-y-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors active:scale-[0.995]"
              >
                <span className="font-bold font-body text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground font-body text-sm leading-relaxed border-t border-border pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
