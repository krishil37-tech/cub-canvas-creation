import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Star } from "lucide-react";

type Testimonial = {
  id: string;
  parent_name: string;
  child_info: string | null;
  quote: string;
  rating: number | null;
  is_visible: boolean | null;
  created_at: string;
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [childInfo, setChildInfo] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name || !quote) return;
    const { error } = await supabase.from("testimonials").insert({ parent_name: name, child_info: childInfo || null, quote, rating });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setName(""); setChildInfo(""); setQuote(""); setRating(5); load(); }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from("testimonials").update({ is_visible: visible }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Testimonials</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <Label className="font-body">Parent Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label className="font-body">Child Info</Label>
              <Input placeholder="e.g. Parent of Aanya, Sr. KG" value={childInfo} onChange={e => setChildInfo(e.target.value)} />
            </div>
          </div>
          <div className="mb-3">
            <Label className="font-body">Quote</Label>
            <Textarea value={quote} onChange={e => setQuote(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`h-5 w-5 cursor-pointer ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} onClick={() => setRating(n)} />
              ))}
            </div>
            <Button onClick={add} className="font-body"><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map(t => (
          <Card key={t.id}>
            <CardContent className="pt-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold font-body text-sm">{t.parent_name}</span>
                  {t.child_info && <span className="text-muted-foreground text-xs">— {t.child_info}</span>}
                </div>
                <p className="text-sm text-foreground">"{t.quote}"</p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`h-3.5 w-3.5 ${n <= (t.rating ?? 5) ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-body">Visible</span>
                  <Switch checked={t.is_visible ?? true} onCheckedChange={(v) => toggleVisibility(t.id, v)} />
                </div>
                <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8 font-body">No testimonials yet.</p>}
      </div>
    </div>
  );
}
