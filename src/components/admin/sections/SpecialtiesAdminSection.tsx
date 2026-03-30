import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import IconPicker, { ICON_MAP } from "@/components/admin/IconPicker";

type Specialty = { id: string; icon: string; title: string; description: string; sort_order: number; is_visible: boolean };

export default function SpecialtiesAdminSection() {
  const [items, setItems] = useState<Specialty[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ icon: "BookOpen", title: "", description: "" });

  const load = async () => {
    const { data } = await (supabase as any).from("specialties").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return;
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("specialties").insert({ ...form, sort_order: maxOrder });
    setForm({ icon: "BookOpen", title: "", description: "" });
    setShowAdd(false);
    load();
    toast.success("Specialty added!");
  };

  const update = async (id: string, updates: Partial<Specialty>) => {
    await (supabase as any).from("specialties").update(updates).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("specialties").delete().eq("id", id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} specialties</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Specialty</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-body">Icon</Label>
                <IconPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-body">Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. CBSE Curriculum" />
              </div>
            </div>
            <div>
              <Label className="text-xs font-body">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.map(item => {
        const Icon = ICON_MAP[item.icon] || ICON_MAP.BookOpen;
        return (
          <Card key={item.id}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid sm:grid-cols-3 gap-2">
                    <div>
                      <IconPicker value={item.icon} onChange={v => update(item.id, { icon: v })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Input defaultValue={item.title} onBlur={e => { if (e.target.value !== item.title) update(item.id, { title: e.target.value }); }} />
                    </div>
                  </div>
                  <Textarea defaultValue={item.description} onBlur={e => { if (e.target.value !== item.description) update(item.id, { description: e.target.value }); }} rows={2} />
                </div>
                <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No specialties yet. Add your first one.</p>}
    </div>
  );
}
