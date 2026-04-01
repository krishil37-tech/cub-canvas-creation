import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = { parent_name: string; child_info: string; quote: string; rating: number; photo_path: string | null; photo_position: string | null };

const fallbackTestimonials: Testimonial[] = [
  { parent_name: "Priya Sharma", child_info: "Parent of Aarav, Jr. KG", quote: "IIRA Cubs has been a blessing for our family. Aarav looks forward to school every single day.", rating: 5, photo_path: null, photo_position: null },
  { parent_name: "Ravi Patel", child_info: "Parent of Anaya, Nursery", quote: "The play-based learning approach has truly transformed Anaya's confidence.", rating: 5, photo_path: null, photo_position: null },
  { parent_name: "Meera Joshi", child_info: "Parent of Kabir, Sr. KG", quote: "We couldn't be happier with the holistic development Kabir has shown.", rating: 5, photo_path: null, photo_position: null },
];

function getPhotoUrl(path: string | null) {
  if (!path) return null;
  return supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    supabase.from("testimonials").select("*").eq("is_visible", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) {
        setTestimonials(data.map((t) => ({
          parent_name: t.parent_name,
          child_info: t.child_info || "",
          quote: t.quote,
          rating: t.rating ?? 5,
          photo_path: t.photo_path,
          photo_position: t.photo_position || "center",
        })));
      }
    });
  }, []);

  return (
    <section id="testimonials" ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Testimonials</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            What People Say
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const photo = getPhotoUrl(t.photo_path);
            return (
              <div key={t.parent_name + i} className={`bg-card rounded-2xl p-6 lg:p-8 shadow-sm shadow-foreground/5 border border-border ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-highlight fill-highlight" />
                  ))}
                </div>
                <p className="text-foreground/80 font-body leading-relaxed italic">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  {photo ? (
                    <img src={photo} alt={t.parent_name} className="w-10 h-10 rounded-full object-cover" style={{ objectPosition: t.photo_position || "center" }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold font-body text-sm">{t.parent_name[0]}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold font-body text-sm text-foreground">{t.parent_name}</div>
                    {t.child_info && <div className="text-xs text-muted-foreground font-body">{t.child_info}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
