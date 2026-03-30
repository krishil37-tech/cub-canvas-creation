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

export default function ContactAdminSection() {
  const [address, setAddress] = useState("Next to Siddheshwar Krishna, Near Earth Allyssum, Bhaili, Vadodara, Gujarat");
  const [phone, setPhone] = useState("+91 265-2650XXX");
  const [email, setEmail] = useState("info@iira.co.in");
  const [hours, setHours] = useState("Mon–Sat: 8:00 AM – 4:00 PM");
  const [mapLink, setMapLink] = useState("");
  const [notifEmail, setNotifEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").eq("section", "contact");
      if (data) {
        for (const r of data) {
          if (r.key === "address") setAddress(r.value);
          if (r.key === "phone") setPhone(r.value);
          if (r.key === "email") setEmail(r.value);
          if (r.key === "hours") setHours(r.value);
          if (r.key === "map_link") setMapLink(r.value);
          if (r.key === "notification_email") setNotifEmail(r.value);
          if (r.key === "whatsapp") setWhatsapp(r.value);
        }
      }
    })();
  }, []);

  const save = async () => {
    await Promise.all([
      upsertContent("contact", "address", address),
      upsertContent("contact", "phone", phone),
      upsertContent("contact", "email", email),
      upsertContent("contact", "hours", hours),
      upsertContent("contact", "map_link", mapLink),
      upsertContent("contact", "notification_email", notifEmail),
      upsertContent("contact", "whatsapp", whatsapp),
    ]);
    toast.success("Contact section saved!");
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body font-semibold">Address</Label>
          <Textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} />
        </div>
        <div>
          <Label className="text-xs font-body font-semibold">Phone</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body font-semibold">Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs font-body font-semibold">Office Hours</Label>
          <Input value={hours} onChange={e => setHours(e.target.value)} />
        </div>
      </div>

      <h4 className="font-display font-bold text-sm mt-4 pt-4 border-t border-border">Map & Notifications</h4>
      <div>
        <Label className="text-xs font-body font-semibold">Google Maps Link</Label>
        <Input value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body font-semibold">Notification Email (receive inquiries)</Label>
          <Input value={notifEmail} onChange={e => setNotifEmail(e.target.value)} placeholder="admin@iira.co.in" />
        </div>
        <div>
          <Label className="text-xs font-body font-semibold">WhatsApp Number (receive messages)</Label>
          <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 7600360036" />
        </div>
      </div>

      <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
    </div>
  );
}
