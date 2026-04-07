import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

type Educator = { id: string; name: string; subject: string; description: string; photo_path: string | null };

function getPhotoUrl(path: string | null) {
  if (!path) return null;
  return supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}

export default function EducatorsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [educators, setEducators] = useState<Educator[]>([]);

  useEffect(() => {
    supabase.from("educators").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data) setEducators(data);
    });
  }, []);

  if (educators.length === 0) return null;

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>
            {get("educators", "section_label", "Our Educators")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            {get("educators", "section_title", "Meet Our Teachers")}
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {educators.map((e, i) => {
            const photo = getPhotoUrl(e.photo_path);
            return (
              <div key={e.id} className={`bg-card rounded-2xl overflow-hidden shadow-sm shadow-foreground/5 border border-border text-center ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                {photo ? (
                  <img src={photo} alt={e.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-primary">{e.name[0]}</span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-bold text-foreground">{e.name}</h3>
                  <p className="text-xs font-body font-semibold text-primary mt-1">{e.subject}</p>
                  {e.description && <p className="mt-2 text-xs text-muted-foreground font-body">{e.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
