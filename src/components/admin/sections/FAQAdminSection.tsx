import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type FAQItem = { id: string; question: string; answer: string; sort_order: number };

export default function FAQAdminSection() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "" });

  const load = async () => {
    const { data } = await (supabase as any).from("faq_items").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.question || !form.answer) return;
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("faq_items").insert({ ...form, sort_order: maxOrder });
    setForm({ question: "", answer: "" });
    setShowAdd(false);
    load();
    toast.success("FAQ added!");
  };

  const update = async (id: string, updates: Partial<FAQItem>) => {
    await (supabase as any).from("faq_items").update(updates).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await (supabase as any).from("faq_items").delete().eq("id", id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} FAQs</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label className="text-xs font-body">Question</Label>
              <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs font-body">Answer</Label>
              <Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={3} />
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
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <Input defaultValue={item.question} onBlur={e => { if (e.target.value !== item.question) update(item.id, { question: e.target.value }); }} className="font-bold" placeholder="Question" />
                <Textarea defaultValue={item.answer} onBlur={e => { if (e.target.value !== item.answer) update(item.id, { answer: e.target.value }); }} rows={2} placeholder="Answer" />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No FAQs yet.</p>}
    </div>
  );
}
