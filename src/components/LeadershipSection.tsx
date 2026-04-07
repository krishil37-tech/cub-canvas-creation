import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";

type Member = { id: string; name: string; role: string; description: string; photo_path: string | null };

function getPhotoUrl(path: string | null) {
  if (!path) return null;
  return supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl;
}

export default function LeadershipSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    supabase.from("leadership_members").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data) setMembers(data);
    });
  }, []);

  if (members.length === 0) return null;

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>
            {get("leadership", "section_label", "Our Pillars")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            {get("leadership", "section_title", "Meet Our Leadership")}
          </h2>
          <p className={`section-subtitle ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
            Visionary leaders dedicated to shaping the future of education.
          </p>
        </div>
        <div className={`mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ${members.length <= 2 ? "max-w-3xl mx-auto" : ""}`}>
          {members.map((m, i) => {
            const photo = getPhotoUrl(m.photo_path);
            return (
              <div key={m.id} className={`card-elevated overflow-hidden p-0 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                {photo && <img src={photo} alt={m.name} className="w-full h-60 object-cover" loading="lazy" />}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-foreground">{m.name}</h3>
                  <p className="text-xs font-body font-bold text-primary mt-1 uppercase tracking-wider">{m.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground font-body leading-relaxed">{m.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
