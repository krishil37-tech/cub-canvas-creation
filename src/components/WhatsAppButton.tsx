import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("section", "contact")
      .eq("key", "whatsapp")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setNumber(data.value.replace(/[^0-9]/g, ""));
      });
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
