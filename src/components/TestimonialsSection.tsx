import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Star, Quote } from "lucide-react";
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
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>Testimonials</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            What Parents Say About Us
          </h2>
          <p className={`section-subtitle ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
            Don't take our word for it — hear from the families who trust us with their children's future.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => {
            const photo = getPhotoUrl(t.photo_path);
            return (
              <div key={t.parent_name + i} className={`card-elevated relative ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                <Quote size={32} className="text-primary/10 absolute top-5 right-5" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={15} className="text-highlight fill-highlight" />
                  ))}
                </div>
                <p className="text-foreground/80 font-body leading-relaxed text-[15px]">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                  {photo ? (
                    <img src={photo} alt={t.parent_name} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10" style={{ objectPosition: t.photo_position || "center" }} loading="lazy" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/5">
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
