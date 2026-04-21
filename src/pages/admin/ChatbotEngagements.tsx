import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Engagement {
  id: string;
  page_path: string;
  user_agent: string | null;
  event_type: string;
  created_at: string;
}

export default function ChatbotEngagements() {
  const [items, setItems] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chatbot_engagements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error("Could not load chatbot engagements.");
    setItems((data as Engagement[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("chatbot_engagements").delete().eq("id", id);
    if (error) return toast.error("Could not delete entry.");
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Deleted.");
  };

  const browser = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (/iPhone|iPad/i.test(ua)) return "iOS";
    if (/Android/i.test(ua)) return "Android";
    if (/Edg/i.test(ua)) return "Edge";
    if (/Chrome/i.test(ua)) return "Chrome";
    if (/Firefox/i.test(ua)) return "Firefox";
    if (/Safari/i.test(ua)) return "Safari";
    return "Other";
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground leading-tight">Chatbot Engagement</h1>
          <p className="text-sm text-muted-foreground font-body">
            Visitors who opened the chatbot. Full conversations live in your chat provider's dashboard.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground font-body text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-body text-sm">
            No chatbot opens yet. Once visitors interact with the floating chat button, they'll appear here.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="font-body text-xs">
                    {new Date(it.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{it.page_path}</TableCell>
                  <TableCell className="font-body text-xs">{browser(it.user_agent)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => remove(it.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
