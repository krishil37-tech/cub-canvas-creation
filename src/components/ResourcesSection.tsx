import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

type Resource = { id: string; title: string; description: string; file_path: string };

export default function ResourcesSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    supabase.from("resources").select("*").eq("is_visible", true).order("sort_order").then(({ data }) => {
      if (data) setResources(data);
    });
  }, []);

  if (resources.length === 0) return null;

  const getUrl = (path: string) => supabase.storage.from("site-documents").getPublicUrl(path).data.publicUrl;

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {get("resources", "section_label", "Resources")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            {get("resources", "section_title", "Downloads & Documents")}
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r, i) => (
            <div key={r.id} className={`bg-card rounded-2xl p-6 shadow-sm shadow-foreground/5 border border-border flex flex-col ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed flex-1">{r.description}</p>
              <a href={getUrl(r.file_path)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-body font-semibold text-primary hover:underline">
                <Download size={14} /> Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
