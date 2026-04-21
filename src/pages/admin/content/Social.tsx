import { Share2 } from "lucide-react";
import SectionPage from "./SectionPage";
import SocialLinksAdminSection from "@/components/admin/sections/SocialLinksAdminSection";

export default function SocialPage() {
  return (
    <SectionPage icon={Share2} title="Social Media" subtitle="Platform Links">
      <SocialLinksAdminSection />
    </SectionPage>
  );
}
