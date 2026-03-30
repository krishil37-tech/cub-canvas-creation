import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type Member = { id: string; name: string; role: string; photo_path: string | null; description: string; sort_order: number };

export default function LeadershipAdminSection() {
  const [items, setItems] = useState<Member[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", description: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await (supabase as any).from("leadership_members").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name) return;
    let photo_path: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `leadership/${Date.now()}.${ext}`;
      await supabase.storage.from(BUCKET).upload(path, photoFile);
      photo_path = path;
    }
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("leadership_members").insert({ ...form, photo_path, sort_order: maxOrder });
    setForm({ name: "", role: "", description: "" });
    setPhotoFile(null);
    setShowAdd(false);
    load();
    toast.success("Leader added!");
  };

  const update = async (id: string, updates: Partial<Member>) => {
    await (supabase as any).from("leadership_members").update(updates).eq("id", id);
    load();
  };

  const uploadPhoto = async (id: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `leadership/${Date.now()}.${ext}`;
    await supabase.storage.from(BUCKET).upload(path, file);
    update(id, { photo_path: path });
  };

  const remove = async (item: Member) => {
    if (item.photo_path) await supabase.storage.from(BUCKET).remove([item.photo_path]);
    await (supabase as any).from("leadership_members").delete().eq("id", item.id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} members</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Leader</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-body">Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs font-body">Role / Title</Label>
                <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Principal" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-body">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label className="text-xs font-body">Photo</Label>
              <Input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
            </div>
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
              {item.photo_path ? (
                <img src={getUrl(item.photo_path)} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-muted-foreground">{item.name[0]}</span>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input defaultValue={item.name} onBlur={e => { if (e.target.value !== item.name) update(item.id, { name: e.target.value }); }} />
                  <Input defaultValue={item.role} onBlur={e => { if (e.target.value !== item.role) update(item.id, { role: e.target.value }); }} />
                </div>
                <Textarea defaultValue={item.description} onBlur={e => { if (e.target.value !== item.description) update(item.id, { description: e.target.value }); }} rows={2} />
                <Input type="file" accept="image/*" className="text-xs" onChange={e => { if (e.target.files?.[0]) uploadPhoto(item.id, e.target.files[0]); }} />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No leadership members yet.</p>}
    </div>
  );
}
