import { GraduationCap } from "lucide-react";
import SectionPage from "./SectionPage";
import EducatorsAdminSection from "@/components/admin/sections/EducatorsAdminSection";

export default function EducatorsPage() {
  return (
    <SectionPage icon={GraduationCap} title="Our Educators" subtitle="Meet Our Teachers">
      <EducatorsAdminSection />
    </SectionPage>
  );
}
