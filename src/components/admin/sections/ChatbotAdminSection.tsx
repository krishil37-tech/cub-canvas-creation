import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, MessageCircle, Play } from "lucide-react";
import { toast } from "sonner";
import ChatbotWidget from "@/components/ChatbotWidget";

async function upsertContent(section: string, key: string, value: string) {
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("section", section)
    .eq("key", key)
    .maybeSingle();
  if (existing) await supabase.from("site_content").update({ value }).eq("id", existing.id);
  else await supabase.from("site_content").insert({ section, key, value });
}

export default function ChatbotAdminSection() {
  const [enabled, setEnabled] = useState(false);
  const [name, setName] = useState("IIRA Assistant");
  const [welcome, setWelcome] = useState("Hi! How can we help you today?");
  const [embedCode, setEmbedCode] = useState("");
  const [color, setColor] = useState("#F97316");
  const [position, setPosition] = useState<"right" | "left">("right");
  const [saving, setSaving] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").eq("section", "chatbot");
      if (data) {
        for (const r of data) {
          if (r.key === "enabled") setEnabled(r.value === "true");
          if (r.key === "name") setName(r.value);
          if (r.key === "welcome") setWelcome(r.value);
          if (r.key === "embed_code") setEmbedCode(r.value);
          if (r.key === "color") setColor(r.value);
          if (r.key === "position") setPosition(r.value === "left" ? "left" : "right");
        }
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsertContent("chatbot", "enabled", enabled ? "true" : "false"),
        upsertContent("chatbot", "name", name),
        upsertContent("chatbot", "welcome", welcome),
        upsertContent("chatbot", "embed_code", embedCode),
        upsertContent("chatbot", "color", color),
        upsertContent("chatbot", "position", position),
      ]);
      toast.success("Chatbot settings saved! Refresh the website to see changes.");
    } catch {
      toast.error("Could not save chatbot settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border">
        <div>
          <div className="font-display font-bold text-sm text-foreground">Enable Chatbot</div>
          <div className="text-xs text-muted-foreground font-body">
            Show the floating chat button on every page of the website.
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body">Bot Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="IIRA Assistant" />
        </div>
        <div>
          <Label className="text-xs font-body">Welcome Subtitle</Label>
          <Input value={welcome} onChange={(e) => setWelcome(e.target.value)} placeholder="Hi! How can we help you today?" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-body">Button Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14 rounded border border-border cursor-pointer bg-card"
            />
            <Input value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-body">Button Position</Label>
          <div className="flex gap-2 mt-1">
            <Button
              type="button"
              variant={position === "right" ? "default" : "outline"}
              onClick={() => setPosition("right")}
              className="flex-1"
            >
              Bottom Right
            </Button>
            <Button
              type="button"
              variant={position === "left" ? "default" : "outline"}
              onClick={() => setPosition("left")}
              className="flex-1"
            >
              Bottom Left
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs font-body">Embed Code (HTML / Script)</Label>
        <Textarea
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          rows={8}
          placeholder='Paste your chatbot provider embed code here. Example for Tawk.to:&#10;&#10;<script type="text/javascript">&#10;var Tawk_API=Tawk_API||{};&#10;(function(){...})();&#10;</script>'
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground font-body mt-1">
          Paste the embed snippet from your chatbot provider (Tawk.to, Crisp, Tidio, Chatbase, etc.). It will be loaded inside the chat panel when a visitor clicks the floating button.
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-dashed border-border">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-md"
          style={{ backgroundColor: color }}
        >
          <MessageCircle className="h-5 w-5" />
        </div>
        <div className="text-xs text-muted-foreground font-body">
          <div className="font-display font-bold text-sm text-foreground">{name}</div>
          {welcome} — appears at <span className="font-medium">bottom {position}</span>.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save Chatbot Settings"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setTestOpen(true)}>
          <Play className="h-4 w-4 mr-2" />
          Test Chatbot
        </Button>
      </div>

      {/* Live preview using current form values — no engagement logging */}
      <ChatbotWidget
        preview
        forceOpen={testOpen}
        onClose={() => setTestOpen(false)}
        overrides={{
          name,
          welcome,
          embedCode,
          color,
          position,
        }}
      />
    </div>
  );
}
