import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

const POSITIONS = ["top", "center", "bottom"];

type Testimonial = {
  id: string; parent_name: string; child_info: string | null; quote: string;
  rating: number | null; is_visible: boolean | null; photo_path?: string | null; photo_position?: string | null;
};

export default function TestimonialsAdminSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ parent_name: "", child_info: "", quote: "", rating: 5 });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as any);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.parent_name || !form.quote) return;
    let photo_path: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `testimonials/${Date.now()}.${ext}`;
      await supabase.storage.from(BUCKET).upload(path, photoFile);
      photo_path = path;
    }
    await supabase.from("testimonials").insert({
      parent_name: form.parent_name,
      child_info: form.child_info || null,
      quote: form.quote,
      rating: form.rating,
      ...(photo_path ? { photo_path } : {}),
    } as any);
    setForm({ parent_name: "", child_info: "", quote: "", rating: 5 });
    setPhotoFile(null);
    setShowAdd(false);
    load();
    toast.success("Testimonial added!");
  };

  const update = async (id: string, updates: any) => {
    await supabase.from("testimonials").update(updates).eq("id", id);
    load();
  };

  const uploadPhoto = async (id: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `testimonials/${Date.now()}.${ext}`;
    await supabase.storage.from(BUCKET).upload(path, file);
    update(id, { photo_path: path });
  };

  const remove = async (item: Testimonial) => {
    if ((item as any).photo_path) await supabase.storage.from(BUCKET).remove([(item as any).photo_path]);
    await supabase.from("testimonials").delete().eq("id", item.id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} testimonials</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="text-xs">Parent Name</Label><Input value={form.parent_name} onChange={e => setForm(f => ({ ...f, parent_name: e.target.value }))} /></div>
              <div><Label className="text-xs">Child Info</Label><Input value={form.child_info} onChange={e => setForm(f => ({ ...f, child_info: e.target.value }))} placeholder="e.g. Parent of Aarav, Class V" /></div>
            </div>
            <div><Label className="text-xs">Quote</Label><Textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={3} /></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`h-5 w-5 cursor-pointer ${n <= form.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} onClick={() => setForm(f => ({ ...f, rating: n }))} />
                ))}
              </div>
            </div>
            <div><Label className="text-xs">Photo</Label><Input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.map(item => (
        <Card key={item.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-20">
                {(item as any).photo_path ? (
                  <div className="space-y-1">
                    <img
                      src={getUrl((item as any).photo_path)}
                      className="w-20 h-20 rounded-lg border border-border"
                      style={{ objectFit: "cover", objectPosition: (item as any).photo_position || "center" }}
                    />
                    <Select
                      value={(item as any).photo_position || "center"}
                      onValueChange={v => update(item.id, { photo_position: v })}
                    >
                      <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-xl font-bold text-muted-foreground">{item.parent_name[0]}</span>
                  </div>
                )}
                <Input type="file" accept="image/*" className="text-[10px] mt-1 h-7" onChange={e => { if (e.target.files?.[0]) uploadPhoto(item.id, e.target.files[0]); }} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold font-body text-sm">{item.parent_name}</span>
                  {item.child_info && <span className="text-muted-foreground text-xs">— {item.child_info}</span>}
                  <div className="flex gap-0.5 ml-auto">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`h-3 w-3 ${n <= (item.rating ?? 5) ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground italic">"{item.quote}"</p>
                <div className="flex items-center gap-2 mt-2">
                  <Switch checked={item.is_visible ?? true} onCheckedChange={v => update(item.id, { is_visible: v })} />
                  <span className="text-xs text-muted-foreground">{item.is_visible !== false ? "Visible" : "Hidden"}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No testimonials yet.</p>}
    </div>
  );
}
