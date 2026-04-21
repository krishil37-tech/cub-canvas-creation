import { FileText } from "lucide-react";
import SectionPage from "./SectionPage";
import ResourcesAdminSection from "@/components/admin/sections/ResourcesAdminSection";

export default function ResourcesPage() {
  return (
    <SectionPage icon={FileText} title="Resources" subtitle="Downloads & Documents">
      <ResourcesAdminSection />
    </SectionPage>
  );
}
