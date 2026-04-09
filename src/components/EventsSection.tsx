import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useSiteContent } from "@/hooks/useSiteContent";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type Event = { id: string; title: string; event_date: string; description: string; image_path: string | null };

export default function EventsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (supabase as any).from("events").select("*").eq("is_visible", true).order("event_date", { ascending: false }).limit(6).then(({ data }: any) => {
      if (data) setEvents(data);
    });
  }, []);

  if (events.length === 0) return null;

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>
            {get("events", "section_label", "School Events")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            {get("events", "section_title", "Upcoming & Past Events")}
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => (
            <div key={ev.id} className={`card-elevated group overflow-hidden ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
              {ev.image_path && (
                <div className="aspect-[16/9] -mx-6 -mt-6 mb-4 overflow-hidden">
                  <img src={getUrl(ev.image_path)} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays size={20} className="text-primary" />
                </div>
                <span className="text-xs font-bold font-body text-muted-foreground">{format(parseISO(ev.event_date), "MMMM d, yyyy")}</span>
              </div>
              <h3 className="text-lg font-display font-bold text-foreground">{ev.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">{ev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
