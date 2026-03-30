import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "site-documents";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type Resource = { id: string; title: string; file_path: string; description: string; sort_order: number };

export default function ResourcesAdminSection() {
  const [items, setItems] = useState<Resource[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from("resources").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title || !file) { toast.error("Title and file are required"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `resources/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("resources").insert({ ...form, file_path: path, sort_order: maxOrder });
    setForm({ title: "", description: "" });
    setFile(null);
    setShowAdd(false);
    setUploading(false);
    load();
    toast.success("Resource added!");
  };

  const update = async (id: string, updates: Partial<Resource>) => {
    await (supabase as any).from("resources").update(updates).eq("id", id);
    load();
  };

  const remove = async (item: Resource) => {
    await supabase.storage.from(BUCKET).remove([item.file_path]);
    await (supabase as any).from("resources").delete().eq("id", item.id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">{items.length} resources</p>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Resource</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label className="text-xs font-body">Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. School Brochure 2026" />
            </div>
            <div>
              <Label className="text-xs font-body">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label className="text-xs font-body">File (PDF, DOC, etc.)</Label>
              <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add} disabled={uploading}>{uploading ? "Uploading…" : "Add"}</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.map(item => (
        <Card key={item.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <Input defaultValue={item.title} onBlur={e => { if (e.target.value !== item.title) update(item.id, { title: e.target.value }); }} className="font-bold" />
                <Textarea defaultValue={item.description} onBlur={e => { if (e.target.value !== item.description) update(item.id, { description: e.target.value }); }} rows={2} />
                <a href={getUrl(item.file_path)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <Download className="h-3 w-3" /> Download File
                </a>
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No resources yet.</p>}
    </div>
  );
}
