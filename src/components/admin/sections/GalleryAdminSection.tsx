import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type GalleryImage = { id: string; image_path: string; label: string; sort_order: number; is_visible: boolean };

export default function GalleryAdminSection() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) { toast.error(error.message); continue; }
      const maxOrder = items.length > 0 ? Math.max(...items.map(g => g.sort_order)) + 1 : 0;
      await supabase.from("gallery_images").insert({
        image_path: path,
        label: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        sort_order: maxOrder,
      });
    }
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Uploaded!");
  };

  const toggleVisibility = async (id: string, vis: boolean) => {
    await supabase.from("gallery_images").update({ is_visible: vis }).eq("id", id);
    load();
  };

  const updateLabel = async (id: string, label: string) => {
    await supabase.from("gallery_images").update({ label }).eq("id", id);
  };

  const remove = async (img: GalleryImage) => {
    await supabase.storage.from(BUCKET).remove([img.image_path]);
    await supabase.from("gallery_images").delete().eq("id", img.id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} images</p>
        <div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={upload} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading…" : "Add Images"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map(img => (
          <Card key={img.id} className={`overflow-hidden ${!img.is_visible ? "opacity-60" : ""}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img src={getUrl(img.image_path)} alt={img.label} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-3 space-y-2">
              <Input defaultValue={img.label} onBlur={e => { if (e.target.value !== img.label) updateLabel(img.id, e.target.value); }} className="text-sm" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={img.is_visible} onCheckedChange={v => toggleVisibility(img.id, v)} />
                  <span className="text-xs text-muted-foreground">{img.is_visible ? "Visible" : "Hidden"}</span>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(img)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && <p className="text-muted-foreground text-center py-6 font-body text-sm">No gallery images yet.</p>}
    </div>
  );
}
