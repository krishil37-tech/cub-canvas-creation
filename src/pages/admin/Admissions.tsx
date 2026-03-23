import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Admission = {
  id: string;
  child_name: string;
  date_of_birth: string | null;
  parent_name: string;
  email: string;
  phone: string;
  program: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export default function Admissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("admissions").select("*").order("created_at", { ascending: false });
    if (data) setAdmissions(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const statusColor = (s: string) => {
    if (s === "pending") return "destructive";
    if (s === "accepted") return "default";
    if (s === "rejected") return "secondary";
    return "outline";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Admissions</h1>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No admissions yet</TableCell></TableRow>
            )}
            {admissions.map((adm) => (
              <TableRow key={adm.id}>
                <TableCell className="whitespace-nowrap text-sm">{format(new Date(adm.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium">{adm.child_name}</TableCell>
                <TableCell className="text-sm">{adm.date_of_birth ? format(new Date(adm.date_of_birth), "MMM d, yyyy") : "—"}</TableCell>
                <TableCell className="text-sm">{adm.parent_name}</TableCell>
                <TableCell className="text-sm">
                  <div>{adm.email}</div>
                  <div className="text-muted-foreground">{adm.phone}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{adm.program}</Badge></TableCell>
                <TableCell>
                  <Select value={adm.status} onValueChange={(v) => updateStatus(adm.id, v)}>
                    <SelectTrigger className="w-[130px] h-8">
                      <Badge variant={statusColor(adm.status) as any}>{adm.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="waitlisted">Waitlisted</SelectItem>
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
