import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function SectionPage({ icon: Icon, title, subtitle, children }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground leading-tight">{title}</h1>
          <p className="text-sm text-muted-foreground font-body">{subtitle}</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        {children}
      </div>
    </div>
  );
}
