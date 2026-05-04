import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

type NavLinkRow = {
  id: string;
  label: string;
  target: string;
  sort_order: number;
  is_visible: boolean;
};

export default function NavigationAdminSection() {
  const [items, setItems] = useState<NavLinkRow[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: "", target: "#" });

  const load = async () => {
    const { data } = await (supabase as any)
      .from("nav_links")
      .select("*")
      .order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.label.trim() || !form.target.trim()) {
      toast.error("Label and target are required");
      return;
    }
    const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
    await (supabase as any).from("nav_links").insert({
      label: form.label.trim(),
      target: form.target.trim(),
      sort_order: nextOrder,
    });
    setForm({ label: "", target: "#" });
    setShowAdd(false);
    load();
    toast.success("Link added!");
  };

  const update = async (id: string, updates: Partial<NavLinkRow>) => {
    await (supabase as any).from("nav_links").update(updates).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("nav_links").delete().eq("id", id);
    load();
    toast.success("Deleted");
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx], b = items[target];
    await (supabase as any).from("nav_links").update({ sort_order: b.sort_order }).eq("id", a.id);
    await (supabase as any).from("nav_links").update({ sort_order: a.sort_order }).eq("id", b.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">
          {items.length} navigation link{items.length === 1 ? "" : "s"}
        </p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label className="text-xs font-body">Label</Label>
              <Input
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="e.g. About"
              />
            </div>
            <div>
              <Label className="text-xs font-body">Target (section anchor or URL)</Label>
              <Input
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="#about"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.map((item, idx) => (
        <Card key={item.id}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 pt-1">
                <Button
                  size="icon" variant="ghost" className="h-7 w-7"
                  onClick={() => move(idx, -1)} disabled={idx === 0}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon" variant="ghost" className="h-7 w-7"
                  onClick={() => move(idx, 1)} disabled={idx === items.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-body">Label</Label>
                    <Input
                      defaultValue={item.label}
                      onBlur={e => { if (e.target.value !== item.label) update(item.id, { label: e.target.value }); }}
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-body">Target</Label>
                    <Input
                      defaultValue={item.target}
                      onBlur={e => { if (e.target.value !== item.target) update(item.id, { target: e.target.value }); }}
                      placeholder="#section or https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Switch
                    checked={item.is_visible}
                    onCheckedChange={(v) => update(item.id, { is_visible: v })}
                  />
                  <span className="text-xs font-body text-muted-foreground">
                    {item.is_visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
              <Button
                size="icon" variant="ghost"
                className="text-destructive h-8 w-8"
                onClick={() => remove(item.id)}
                aria-label="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && (
        <p className="text-muted-foreground text-center py-6 font-body text-sm">
          No navigation links yet. Add your first link.
        </p>
      )}
    </div>
  );
}
