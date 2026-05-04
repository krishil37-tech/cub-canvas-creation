import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

interface PageLoaderProps {
  /** Minimum visible time in ms (prevents flash). Default 700ms. */
  minDuration?: number;
}

/**
 * Full-screen loader: STATIC logo (no transforms/filters), with bouncing
 * dots and an indeterminate progress bar underneath.
 */
export default function PageLoader({ minDuration = 700 }: PageLoaderProps) {
  const [hidden, setHidden] = useState(false);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setUnmount(true), 400);
    return () => clearTimeout(t);
  }, [hidden]);

  if (unmount) return null;

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-400 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="logo-surface px-5 py-3">
        {/* STATIC logo — no animation, no filter */}
        <img
          src={logo}
          alt="IIRA Cubs Pre-School"
          className="h-16 w-auto object-contain protect-media"
          style={{ animation: "none", transform: "none" }}
        />
      </div>

      <div className="mt-6 flex items-center gap-1.5" aria-label="Loading">
        <span className="loader-dot" style={{ animationDelay: "0ms" }} />
        <span className="loader-dot" style={{ animationDelay: "150ms" }} />
        <span className="loader-dot" style={{ animationDelay: "300ms" }} />
      </div>

      <div className="mt-5 w-44 h-1 rounded-full bg-secondary overflow-hidden">
        <div className="loader-bar h-full rounded-full bg-primary" />
      </div>

      <style>{`
        @keyframes loaderDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        .loader-dot {
          width: 8px; height: 8px; border-radius: 9999px;
          background: hsl(var(--primary));
          display: inline-block;
          animation: loaderDot 1s ease-in-out infinite;
        }
        @keyframes loaderBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .loader-bar {
          width: 40%;
          animation: loaderBar 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
