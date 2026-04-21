import { HelpCircle } from "lucide-react";
import SectionPage from "./SectionPage";
import FAQAdminSection from "@/components/admin/sections/FAQAdminSection";

export default function FAQPage() {
  return (
    <SectionPage icon={HelpCircle} title="FAQ" subtitle="Frequently Asked Questions">
      <FAQAdminSection />
    </SectionPage>
  );
}
