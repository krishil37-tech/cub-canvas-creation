import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type Blog = { id: string; type: string; title: string; description: string; link: string; image_path: string | null };

export default function BlogsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    (supabase as any).from("blogs").select("*").eq("is_visible", true).order("sort_order").then(({ data }: any) => {
      if (data) setBlogs(data);
    });
  }, []);

  if (blogs.length === 0) return null;

  const typeColors: Record<string, string> = {
    Student: "bg-blue-100 text-blue-700",
    Mentor: "bg-green-100 text-green-700",
    Educator: "bg-purple-100 text-purple-700",
    Management: "bg-amber-100 text-amber-700",
  };

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : ""}`}>
            {get("blogs", "section_label", "Community Blogs")}
          </span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            {get("blogs", "section_title", "Voices from IIRA")}
          </h2>
          <p className={`mt-3 text-muted-foreground font-body ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
            {get("blogs", "section_description", "Explore stories, ideas, and perspectives shared by students, mentors, educators, and school leadership.")}
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b, i) => (
            <div key={b.id} className={`bg-card rounded-2xl overflow-hidden shadow-sm shadow-foreground/5 border border-border flex flex-col ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
              {b.image_path && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={getUrl(b.image_path)} alt={b.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <span className={`text-xs font-bold font-body px-3 py-1 rounded-full self-start ${typeColors[b.type] || "bg-secondary text-muted-foreground"}`}>{b.type}</span>
                <h3 className="mt-3 text-lg font-display font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed flex-1">{b.description}</p>
                {b.link && (
                  <a href={b.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-body font-semibold text-primary hover:underline">
                    Visit Blog <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
