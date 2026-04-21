import { useEffect, useState, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

interface Overrides {
  name?: string;
  welcome?: string;
  embedCode?: string;
  color?: string;
  position?: "right" | "left";
}

interface Props {
  /** Preview mode: ignores the `enabled` setting and skips engagement logging. */
  preview?: boolean;
  /** Controlled open state (used by admin Test button). */
  forceOpen?: boolean;
  onClose?: () => void;
  /** Override saved settings (used by admin Test button to preview unsaved edits). */
  overrides?: Overrides;
}

export default function ChatbotWidget({ preview = false, forceOpen, onClose, overrides }: Props) {
  const { get, loading } = useSiteContent();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = forceOpen !== undefined ? forceOpen : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);
  const loggedRef = useRef(false);

  const enabled = get("chatbot", "enabled", "false") === "true";
  const botName = overrides?.name ?? get("chatbot", "name", "IIRA Assistant");
  const welcome = overrides?.welcome ?? get("chatbot", "welcome", "Hi! How can we help you today?");
  const embedCode = overrides?.embedCode ?? get("chatbot", "embed_code", "");
  const color = overrides?.color ?? get("chatbot", "color", "#F97316");
  const position = overrides?.position ?? get("chatbot", "position", "right"); // 'right' | 'left'

  // Inject embed code once when first opened
  useEffect(() => {
    if (!open || !embedCode || !containerRef.current) return;
    if (containerRef.current.dataset.injected === "true") return;

    containerRef.current.innerHTML = embedCode;
    // Re-execute any <script> tags found in embed code
    containerRef.current.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.text = oldScript.text;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
    containerRef.current.dataset.injected = "true";
  }, [open, embedCode]);

  const handleOpen = async () => {
    setInternalOpen(true);
    if (preview || loggedRef.current) return;
    loggedRef.current = true;
    try {
      await supabase.from("chatbot_engagements").insert({
        page_path: window.location.pathname,
        user_agent: navigator.userAgent.slice(0, 500),
        event_type: "opened",
      });
    } catch {
      // silent — never block UX on logging
    }
  };

  const handleClose = () => {
    setInternalOpen(false);
    onClose?.();
  };

  if (loading) return null;
  if (!preview && !enabled) return null;

  const sideClass = position === "left" ? "left-5" : "right-5";

  return (
    <>
      {/* Floating button (hidden in preview mode) */}
      {!open && !preview && (
        <button
          onClick={handleOpen}
          aria-label="Open chat"
          className={`fixed bottom-5 ${sideClass} z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform animate-pulse`}
          style={{ backgroundColor: color }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed bottom-5 ${sideClass} z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-2.5rem))] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
        >
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: color }}
          >
            <div>
              <div className="font-display font-bold text-sm">{botName}</div>
              <div className="text-[11px] opacity-90 font-body">{welcome}</div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close chat"
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={containerRef} className="flex-1 overflow-auto bg-background">
            {!embedCode && (
              <div className="p-6 text-center text-sm text-muted-foreground font-body">
                Chatbot is enabled but no embed code has been configured yet. Add one from the Admin Panel → Chatbot section.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
