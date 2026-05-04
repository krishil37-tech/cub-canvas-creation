import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeToggleProps {
  variant?: "light" | "dark";
}

const STORAGE_KEY = "iira-theme";

export default function ThemeToggle({ variant = "dark" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    // Persist locally first (instant, survives reload)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}

    // Background sync to DB — never blocks UI, never affects images
    supabase
      .from("site_content")
      .upsert(
        { section: "settings", key: "theme", value: next ? "dark" : "light" },
        { onConflict: "section,key" }
      )
      .then(() => {});
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
