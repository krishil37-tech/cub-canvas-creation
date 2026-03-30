import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BLOG_TYPES = ["Mentor", "Educator", "Student", "Management"];

type Blog = { id: string; type: string; title: string; description: string; link: string; sort_order: number };

export default function BlogsAdminSection() {
  const [items, setItems] = useState<Blog[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "Student", title: "", description: "", link: "" });

  const load = async () => {
    const { data } = await (supabase as any).from("blogs").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return;
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("blogs").insert({ ...form, sort_order: maxOrder });
    setForm({ type: "Student", title: "", description: "", link: "" });
    setShowAdd(false);
    load();
    toast.success("Blog added!");
  };

  const update = async (id: string, updates: Partial<Blog>) => {
    await (supabase as any).from("blogs").update(updates).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("blogs").delete().eq("id", id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} blogs</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Blog</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-body">Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BLOG_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-body">Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs font-body">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label className="text-xs font-body">Blog Link</Label>
              <Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
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
              <div className="shrink-0 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">{item.type}</div>
              <div className="flex-1 space-y-2">
                <Input defaultValue={item.title} onBlur={e => { if (e.target.value !== item.title) update(item.id, { title: e.target.value }); }} className="font-bold" />
                <Textarea defaultValue={item.description} onBlur={e => { if (e.target.value !== item.description) update(item.id, { description: e.target.value }); }} rows={2} />
                <Input defaultValue={item.link} onBlur={e => { if (e.target.value !== item.link) update(item.id, { link: e.target.value }); }} placeholder="Blog URL" />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No blogs yet.</p>}
    </div>
  );
}
