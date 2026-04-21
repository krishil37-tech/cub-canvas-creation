import { Sparkles } from "lucide-react";
import SectionPage from "./SectionPage";
import SpecialtiesAdminSection from "@/components/admin/sections/SpecialtiesAdminSection";

export default function SpecialtiesPage() {
  return (
    <SectionPage icon={Sparkles} title="Our Specialties" subtitle="What Makes Us Special">
      <SpecialtiesAdminSection />
    </SectionPage>
  );
}
