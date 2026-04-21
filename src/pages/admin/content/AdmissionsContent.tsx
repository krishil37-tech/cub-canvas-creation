import { School } from "lucide-react";
import SectionPage from "./SectionPage";
import AdmissionsAdminSection from "@/components/admin/sections/AdmissionsAdminSection";

export default function AdmissionsContentPage() {
  return (
    <SectionPage icon={School} title="Admissions Section" subtitle="Enrollment Information">
      <AdmissionsAdminSection />
    </SectionPage>
  );
}
