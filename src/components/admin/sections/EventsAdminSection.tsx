import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, CalendarIcon, Upload, ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BUCKET = "site-images";
const getUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type Event = { id: string; title: string; event_date: string; description: string; sort_order: number; is_visible: boolean; image_path: string | null };

const currentYear = new Date().getFullYear();
const lastYear = currentYear - 1;

export default function EventsAdminSection() {
  const [items, setItems] = useState<Event[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", event_date: new Date(), description: "" });
  const [addPhoto, setAddPhoto] = useState<File | null>(null);

  const load = async () => {
    const { data } = await (supabase as any).from("events").select("*").order("event_date", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const [yearFilter, setYearFilter] = useState<number>(currentYear);
  const filtered = items.filter(e => new Date(e.event_date).getFullYear() === yearFilter);

  const add = async () => {
    if (!form.title) return;
    let image_path: string | null = null;
    if (addPhoto) {
      const ext = addPhoto.name.split(".").pop();
      const path = `events/${Date.now()}.${ext}`;
      await supabase.storage.from(BUCKET).upload(path, addPhoto);
      image_path = path;
    }
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    await (supabase as any).from("events").insert({
      title: form.title,
      event_date: format(form.event_date, "yyyy-MM-dd"),
      description: form.description,
      sort_order: maxOrder,
      image_path,
    });
    setForm({ title: "", event_date: new Date(), description: "" });
    setAddPhoto(null);
    setShowAdd(false);
    load();
    toast.success("Event added!");
  };

  const update = async (id: string, updates: any) => {
    await (supabase as any).from("events").update(updates).eq("id", id);
    load();
  };

  const uploadPhoto = async (id: string, file: File, oldPath: string | null) => {
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
    const ext = file.name.split(".").pop();
    const path = `events/${Date.now()}.${ext}`;
    await supabase.storage.from(BUCKET).upload(path, file);
    update(id, { image_path: path });
  };

  const removePhoto = async (id: string, path: string) => {
    await supabase.storage.from(BUCKET).remove([path]);
    update(id, { image_path: null });
  };

  const remove = async (item: Event) => {
    if (item.image_path) await supabase.storage.from(BUCKET).remove([item.image_path]);
    await (supabase as any).from("events").delete().eq("id", item.id);
    load();
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <Button size="sm" variant={yearFilter === currentYear ? "default" : "outline"} onClick={() => setYearFilter(currentYear)}>{currentYear}</Button>
          <Button size="sm" variant={yearFilter === lastYear ? "default" : "outline"} onClick={() => setYearFilter(lastYear)}>{lastYear}</Button>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add Event</Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="pt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-body">Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Annual Sports Day" />
              </div>
              <div>
                <Label className="text-xs font-body">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.event_date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.event_date ? format(form.event_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={form.event_date} onSelect={d => d && setForm(f => ({ ...f, event_date: d }))} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className="text-xs font-body">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label className="text-xs font-body">Event Image (optional)</Label>
              <Input type="file" accept="image/*" onChange={e => setAddPhoto(e.target.files?.[0] || null)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={add}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.map(item => (
        <Card key={item.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {/* Image preview */}
              {item.image_path ? (
                <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                  <img src={getUrl(item.image_path)} className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(item.id, item.image_path!)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="text-center shrink-0 w-14">
                <div className="text-xl font-display font-bold text-primary">{format(parseISO(item.event_date), "dd")}</div>
                <div className="text-xs text-muted-foreground font-body">{format(parseISO(item.event_date), "MMM yy")}</div>
              </div>
              <div className="flex-1 space-y-2">
                <Input defaultValue={item.title} onBlur={e => { if (e.target.value !== item.title) update(item.id, { title: e.target.value }); }} className="font-bold" />
                <Textarea defaultValue={item.description} onBlur={e => { if (e.target.value !== item.description) update(item.id, { description: e.target.value }); }} rows={2} />
                <Input type="file" accept="image/*" className="text-xs" onChange={e => { if (e.target.files?.[0]) uploadPhoto(item.id, e.target.files[0], item.image_path); }} />
              </div>
              <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {filtered.length === 0 && !showAdd && <p className="text-muted-foreground text-center py-6 font-body text-sm">No events for {yearFilter}.</p>}
    </div>
  );
}
