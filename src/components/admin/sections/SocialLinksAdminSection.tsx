import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PLATFORMS = [
  "Facebook", "Instagram", "Twitter", "YouTube", "LinkedIn",
  "Pinterest", "WhatsApp", "Telegram", "Snapchat", "TikTok",
  "Reddit", "Discord", "GitHub", "Threads",
];

type SocialLink = { id: string; platform: string; url: string; sort_order: number };

export default function SocialLinksAdminSection() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ platform: "Facebook", url: "" });

  const load = async () => {
    const { data } = await (supabase as any).from("social_links").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.url) return;
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("social_links").insert({ ...form, sort_order: maxOrder });
    setForm({ platform: "Facebook", url: "" });
    setShowAdd(false);
    load();
    toast.success("Social link added!");
  };

  const update = async (id: string, updates: Partial<SocialLink>) => {
    await (supabase as any).from("social_links").update(updates).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("social_links").delete().eq("id", id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} links</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Social Link</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-body">Platform</Label>
                <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-body">URL</Label>
                <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
              </div>
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
            <div className="flex items-center gap-3">
              <div className="shrink-0 px-3 py-1 rounded bg-primary/10 text-primary text-sm font-bold min-w-[90px] text-center">{item.platform}</div>
              <Input defaultValue={item.url} onBlur={e => { if (e.target.value !== item.url) update(item.id, { url: e.target.value }); }} className="flex-1" placeholder="URL" />
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No social links yet.</p>}
    </div>
  );
}
