import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeToggleProps {
  variant?: "light" | "dark";
}

export default function ThemeToggle({ variant = "dark" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = async () => {
    if (saving) return;
    const next = !isDark;
    setIsDark(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    setSaving(true);
    try {
      await supabase
        .from("site_content")
        .upsert(
          { section: "settings", key: "theme", value: next ? "dark" : "light" },
          { onConflict: "section,key" }
        );
    } catch (e) {
      // Silent — theme still applied locally for this session
    } finally {
      setSaving(false);
    }
  };

  const colorClass =
    variant === "light"
      ? "text-foreground hover:bg-secondary"
      : "text-primary-foreground hover:bg-primary-foreground/10";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`p-2 rounded-lg transition-colors ${colorClass}`}
      type="button"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
