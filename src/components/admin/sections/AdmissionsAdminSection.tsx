import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";

async function upsertContent(section: string, key: string, value: string) {
  const { data: existing } = await supabase.from("site_content").select("id").eq("section", section).eq("key", key).maybeSingle();
  if (existing) await supabase.from("site_content").update({ value }).eq("id", existing.id);
  else await supabase.from("site_content").insert({ section, key, value });
}

export default function AdmissionsAdminSection() {
  const [label, setLabel] = useState("Admissions 2026–27");
  const [title, setTitle] = useState("Admissions Open for Nursery – Class X");
  const [description, setDescription] = useState("Secure your child's future with a world-class education at IIRA International School, Vadodara. Limited seats available — apply today.");
  const [applyLink, setApplyLink] = useState("#admissions");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").eq("section", "admissions");
      if (data) {
        for (const r of data) {
          if (r.key === "label") setLabel(r.value);
          if (r.key === "title") setTitle(r.value);
          if (r.key === "description") setDescription(r.value);
          if (r.key === "apply_link") setApplyLink(r.value);
        }
      }
    })();
  }, []);

  const save = async () => {
    await Promise.all([
      upsertContent("admissions", "label", label),
      upsertContent("admissions", "title", title),
      upsertContent("admissions", "description", description),
      upsertContent("admissions", "apply_link", applyLink),
    ]);
    toast.success("Admissions section saved!");
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body">Year Label (e.g. Admissions 2026–27)</Label>
          <Input value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs font-body">Apply Now Button Link</Label>
          <Input value={applyLink} onChange={e => setApplyLink(e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="text-xs font-body">Title</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-body">Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>
      <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
    </div>
  );
}
