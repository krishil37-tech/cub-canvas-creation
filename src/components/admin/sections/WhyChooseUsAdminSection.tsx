import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-images";
const getPublicUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

async function upsertContent(section: string, key: string, value: string) {
  const { data: existing } = await supabase.from("site_content").select("id").eq("section", section).eq("key", key).maybeSingle();
  if (existing) await supabase.from("site_content").update({ value }).eq("id", existing.id);
  else await supabase.from("site_content").insert({ section, key, value });
}

export default function WhyChooseUsAdminSection() {
  const [sectionLabel, setSectionLabel] = useState("Why Choose Us");
  const [sectionTitle, setSectionTitle] = useState("More Than a School");
  const [description, setDescription] = useState("The IIRA International School Vadodara is about the spirit, morals and ethics of India. A revolutionary, futuristic and tranquil institution nurtures an ideal educational environment. A blend of tradition and modernity, this institution imparts a natural impetus towards excellence in all spheres of life.");
  const [badgeText, setBadgeText] = useState("10+ Years of Trust");
  const [imagePath, setImagePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<{ text: string }[]>([
    { text: "Experienced & Dedicated Faculty" },
    { text: "CBSE Curriculum with Holistic Approach" },
    { text: "Stress-Free Learning Environment" },
    { text: "Strong Co-Curricular Programs" },
    { text: "Safe & Inclusive Campus" },
    { text: "Award-Winning Most Progressive School" },
  ]);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").eq("section", "about");
      if (data) {
        for (const r of data) {
          if (r.key === "section_label") setSectionLabel(r.value);
          if (r.key === "section_title") setSectionTitle(r.value);
          if (r.key === "description") setDescription(r.value);
          if (r.key === "badge_text") setBadgeText(r.value);
          if (r.key === "reasons") try { setFeatures(JSON.parse(r.value)); } catch {}
          if (r.key === "image") setImagePath(r.value);
        }
      }
    })();
  }, []);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Remove old image if exists
    if (imagePath) {
      await supabase.storage.from(BUCKET).remove([imagePath]);
    }
    const ext = file.name.split(".").pop();
    const path = `about/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    setImagePath(path);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Image uploaded!");
  };

  const removeImage = async () => {
    if (imagePath) {
      await supabase.storage.from(BUCKET).remove([imagePath]);
      setImagePath("");
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures(prev => [...prev, { text: newFeature.trim() }]);
    setNewFeature("");
  };

  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    await Promise.all([
      upsertContent("about", "section_label", sectionLabel),
      upsertContent("about", "section_title", sectionTitle),
      upsertContent("about", "description", description),
      upsertContent("about", "badge_text", badgeText),
      upsertContent("about", "reasons", JSON.stringify(features)),
      upsertContent("about", "image", imagePath),
    ]);
    toast.success("Why Choose Us section saved!");
  };

  return (
    <div className="space-y-4">
      {/* Section Image */}
      <h4 className="font-display font-bold text-sm">Section Image</h4>
      <div className="flex items-start gap-4">
        {imagePath ? (
          <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-border">
            <img src={getPublicUrl(imagePath)} className="w-full h-full object-cover" />
            <button onClick={removeImage} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="w-40 h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading…" : "Change Image"}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">Recommended: 800×600px</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-body text-xs">Section Label</Label>
          <Input value={sectionLabel} onChange={e => setSectionLabel(e.target.value)} />
        </div>
        <div>
          <Label className="font-body text-xs">Section Title</Label>
          <Input value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="font-body text-xs">Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
      </div>
      <div>
        <Label className="font-body text-xs">Badge Text</Label>
        <Input value={badgeText} onChange={e => setBadgeText(e.target.value)} className="max-w-xs" />
      </div>

      <h4 className="font-display font-bold text-sm mt-4">Features</h4>
      <div className="space-y-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={f.text} onChange={e => { const n = [...features]; n[i] = { text: e.target.value }; setFeatures(n); }} className="flex-1" />
            <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => removeFeature(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Input placeholder="New feature…" value={newFeature} onChange={e => setNewFeature(e.target.value)} className="flex-1" onKeyDown={e => e.key === "Enter" && addFeature()} />
          <Button size="sm" variant="outline" onClick={addFeature}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </div>

      <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
    </div>
  );
}
