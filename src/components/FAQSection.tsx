import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

type FaqItem = { id: string; question: string; answer: string };

const defaultFaqs: FaqItem[] = [
  { id: "1", question: "What age groups do you accept?", answer: "We accept children from 1.5 years to 5.5 years across our Playgroup, Nursery, Jr. KG, and Sr. KG programs." },
  { id: "2", question: "What is the student-teacher ratio?", answer: "We maintain a low 10:1 student-teacher ratio to ensure personalized attention for every child." },
  { id: "3", question: "What curriculum do you follow?", answer: "We follow a play-based learning curriculum that integrates early literacy, numeracy, arts, music, and outdoor exploration." },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);

  useEffect(() => {
    supabase.from("faq_items").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setFaqs(data);
    });
  }, []);

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
            <div key={faq.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors active:scale-[0.995]">
                <span className="font-bold font-body text-foreground pr-4">{faq.question}</span>
                <ChevronDown size={20} className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground font-body text-sm leading-relaxed border-t border-border pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
