import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-images";

function getPublicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function upsertContent(section: string, key: string, value: string) {
  const { data: existing } = await supabase.from("site_content").select("id").eq("section", section).eq("key", key).maybeSingle();
  if (existing) await supabase.from("site_content").update({ value }).eq("id", existing.id);
  else await supabase.from("site_content").insert({ section, key, value });
}

export default function HomeAdminSection() {
  const [stats, setStats] = useState([
    { value: "10+", label: "Years of Excellence" },
    { value: "500+", label: "Happy Children" },
    { value: "100%", label: "Parent Satisfaction" },
    { value: "25+", label: "Awards Won" },
  ]);
  const [tagline, setTagline] = useState("Trusted by 500+ families — nurturing young minds since 2014.");
  const [slide1Title, setSlide1Title] = useState("Where Little Learners Grow Big Dreams");
  const [slide1Sub, setSlide1Sub] = useState("A nurturing preschool experience rooted in play, creativity, and love.");
  const [slide2Title, setSlide2Title] = useState("Learning Through Joy & Discovery");
  const [slide2Sub, setSlide2Sub] = useState("Hands-on activities that spark curiosity and build confident young minds.");
  const [ctaText, setCtaText] = useState("Enroll Now");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").in("section", ["stats", "hero"]);
      if (data) {
        for (const r of data) {
          if (r.section === "stats" && r.key === "items") try { setStats(JSON.parse(r.value)); } catch {}
          if (r.section === "stats" && r.key === "tagline") setTagline(r.value);
          if (r.section === "hero" && r.key === "slide1_title") setSlide1Title(r.value);
          if (r.section === "hero" && r.key === "slide1_subtitle") setSlide1Sub(r.value);
          if (r.section === "hero" && r.key === "slide2_title") setSlide2Title(r.value);
          if (r.section === "hero" && r.key === "slide2_subtitle") setSlide2Sub(r.value);
          if (r.section === "hero" && r.key === "cta_text") setCtaText(r.value);
          if (r.section === "hero" && r.key === "images") try { setHeroImages(JSON.parse(r.value)); } catch {}
        }
      }
    })();
  }, []);

  const save = async () => {
    await Promise.all([
      upsertContent("stats", "items", JSON.stringify(stats)),
      upsertContent("stats", "tagline", tagline),
      upsertContent("hero", "slide1_title", slide1Title),
      upsertContent("hero", "slide1_subtitle", slide1Sub),
      upsertContent("hero", "slide2_title", slide2Title),
      upsertContent("hero", "slide2_subtitle", slide2Sub),
      upsertContent("hero", "cta_text", ctaText),
      upsertContent("hero", "images", JSON.stringify(heroImages)),
    ]);
    toast.success("Home section saved!");
  };

  const uploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `hero/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    setHeroImages(prev => [...prev, path]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Image uploaded!");
  };

  const removeHeroImage = async (path: string) => {
    await supabase.storage.from(BUCKET).remove([path]);
    setHeroImages(prev => prev.filter(p => p !== path));
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display font-bold text-lg">Stats Blocks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-4 space-y-2">
              <div>
                <Label className="text-xs font-body">Value</Label>
                <Input value={s.value} onChange={e => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setStats(n); }} />
              </div>
              <div>
                <Label className="text-xs font-body">Label</Label>
                <Input value={s.label} onChange={e => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; setStats(n); }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Label className="font-body font-semibold">Stats Tagline</Label>
        <Input value={tagline} onChange={e => setTagline(e.target.value)} className="mt-1" />
      </div>

      <h3 className="font-display font-bold text-lg mt-6">Hero Slides</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-2">
            <Label className="text-xs font-body text-muted-foreground">Slide 1 Title</Label>
            <Input value={slide1Title} onChange={e => setSlide1Title(e.target.value)} />
            <Label className="text-xs font-body text-muted-foreground">Slide 1 Subtitle</Label>
            <Textarea value={slide1Sub} onChange={e => setSlide1Sub(e.target.value)} rows={2} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <Label className="text-xs font-body text-muted-foreground">Slide 2 Title</Label>
            <Input value={slide2Title} onChange={e => setSlide2Title(e.target.value)} />
            <Label className="text-xs font-body text-muted-foreground">Slide 2 Subtitle</Label>
            <Textarea value={slide2Sub} onChange={e => setSlide2Sub(e.target.value)} rows={2} />
          </CardContent>
        </Card>
      </div>

      <div>
        <Label className="font-body font-semibold">CTA Button Text</Label>
        <Input value={ctaText} onChange={e => setCtaText(e.target.value)} className="mt-1 max-w-xs" />
      </div>

      <h3 className="font-display font-bold text-lg mt-6">Hero Images</h3>
      <div className="flex flex-wrap gap-3">
        {heroImages.map((path) => (
          <div key={path} className="relative w-32 h-24 rounded-lg overflow-hidden border border-border">
            <img src={getPublicUrl(path)} className="w-full h-full object-cover" />
            <button onClick={() => removeHeroImage(path)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading…" : "Add Image"}
          </Button>
        </div>
      </div>

      <Button onClick={save} className="mt-4"><Save className="h-4 w-4 mr-2" /> Save Home Section</Button>
    </div>
  );
}
