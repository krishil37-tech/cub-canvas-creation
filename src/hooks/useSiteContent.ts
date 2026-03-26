import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ContentMap = Record<string, Record<string, string>>;

let cache: ContentMap | null = null;
let listeners: Array<(data: ContentMap) => void> = [];

async function fetchContent() {
  const { data } = await supabase.from("site_content").select("*");
  const map: ContentMap = {};
  if (data) {
    for (const row of data) {
      if (!map[row.section]) map[row.section] = {};
      map[row.section][row.key] = row.value;
    }
  }
  cache = map;
  listeners.forEach((fn) => fn(map));
  return map;
}

export function useSiteContent() {
  const [content, setContent] = useState<ContentMap>(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setContent(cache);
      setLoading(false);
      return;
    }
    listeners.push(setContent);
    fetchContent().then(() => setLoading(false));
    return () => {
      listeners = listeners.filter((fn) => fn !== setContent);
    };
  }, []);

  const get = (section: string, key: string, fallback = "") =>
    content[section]?.[key] ?? fallback;

  const getJSON = <T,>(section: string, key: string, fallback: T): T => {
    const raw = content[section]?.[key];
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
  };

  return { content, loading, get, getJSON };
}
