import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Inquiry = {
  id: string;
  parent_name: string;
  email: string;
  phone: string | null;
  child_name: string | null;
  child_age: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const statusColor = (s: string) => {
    if (s === "new") return "destructive";
    if (s === "contacted") return "default";
    return "secondary";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Inquiries</h1>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No inquiries yet</TableCell></TableRow>
            )}
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="whitespace-nowrap text-sm">{format(new Date(inq.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium">{inq.parent_name}</TableCell>
                <TableCell className="text-sm">{inq.email}</TableCell>
                <TableCell className="text-sm">{inq.phone || "—"}</TableCell>
                <TableCell className="text-sm">{inq.child_name ? `${inq.child_name} (${inq.child_age || "?"})` : "—"}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{inq.message || "—"}</TableCell>
                <TableCell>
                  <Select value={inq.status} onValueChange={(v) => updateStatus(inq.id, v)}>
                    <SelectTrigger className="w-[130px] h-8">
                      <Badge variant={statusColor(inq.status) as any}>{inq.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
