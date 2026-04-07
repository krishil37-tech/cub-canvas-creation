import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, GraduationCap, Star, Clock, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState({ inquiries: 0, newInquiries: 0, admissions: 0, pendingAdmissions: 0, testimonials: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoading, setThemeLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [inq, newInq, adm, pendAdm, test] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("admissions").select("id", { count: "exact", head: true }),
        supabase.from("admissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        inquiries: inq.count ?? 0,
        newInquiries: newInq.count ?? 0,
        admissions: adm.count ?? 0,
        pendingAdmissions: pendAdm.count ?? 0,
        testimonials: test.count ?? 0,
      });
    };
    load();
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("section", "settings")
        .eq("key", "theme")
        .maybeSingle();
      setDarkMode(data?.value === "dark");
      setThemeLoading(false);
    };
    loadTheme();
  }, []);

  const toggleTheme = async (checked: boolean) => {
    setDarkMode(checked);
    const value = checked ? "dark" : "light";
    const { error } = await supabase
      .from("site_content")
      .upsert({ section: "settings", key: "theme", value }, { onConflict: "section,key" });
    if (error) {
      toast.error("Failed to save theme");
      setDarkMode(!checked);
    } else {
      toast.success(`Website theme set to ${value}`);
    }
  };

  const cards = [
    { label: "Total Inquiries", value: stats.inquiries, icon: MessageSquare, color: "text-primary" },
    { label: "New Inquiries", value: stats.newInquiries, icon: Clock, color: "text-destructive" },
    { label: "Total Admissions", value: stats.admissions, icon: GraduationCap, color: "text-accent" },
    { label: "Pending Admissions", value: stats.pendingAdmissions, icon: Clock, color: "text-highlight" },
    { label: "Testimonials", value: stats.testimonials, icon: Star, color: "text-sky" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Dashboard</h1>

      {/* Theme Toggle */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-body font-medium text-muted-foreground">Website Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Sun className="h-5 w-5 text-highlight" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleTheme}
              disabled={themeLoading}
            />
            <Moon className="h-5 w-5 text-muted-foreground" />
            <Label className="text-sm font-body text-foreground">
              {darkMode ? "Dark Background" : "Light Background"}
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-body">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
