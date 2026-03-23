import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2 } from "lucide-react";

type ContentItem = {
  id: string;
  section: string;
  key: string;
  value: string;
};

export default function Content() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newSection, setNewSection] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("section");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const save = async (id: string, value: string) => {
    const { error } = await supabase.from("site_content").update({ value }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Saved" });
  };

  const add = async () => {
    if (!newSection || !newKey || !newValue) return;
    const { error } = await supabase.from("site_content").insert({ section: newSection, key: newKey, value: newValue });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewSection(""); setNewKey(""); setNewValue(""); load(); }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("site_content").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const sections = [...new Set(items.map(i => i.section))];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Site Content</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base font-body">Add New Content</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="font-body">Section</Label>
              <Input placeholder="e.g. hero" value={newSection} onChange={e => setNewSection(e.target.value)} />
            </div>
            <div>
              <Label className="font-body">Key</Label>
              <Input placeholder="e.g. title" value={newKey} onChange={e => setNewKey(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={add} className="font-body"><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
          </div>
          <div className="mt-3">
            <Label className="font-body">Value</Label>
            <Textarea placeholder="Content value…" value={newValue} onChange={e => setNewValue(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {sections.map(section => (
        <Card key={section} className="mb-4">
          <CardHeader><CardTitle className="text-base font-body capitalize">{section}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {items.filter(i => i.section === section).map(item => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Label className="font-body text-muted-foreground text-xs">{item.key}</Label>
                  <Textarea
                    defaultValue={item.value}
                    onBlur={e => { if (e.target.value !== item.value) save(item.id, e.target.value); }}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-1 pt-5">
                  <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && (
        <p className="text-muted-foreground text-center py-8 font-body">No content items yet. Add your first one above.</p>
      )}
    </div>
  );
}
