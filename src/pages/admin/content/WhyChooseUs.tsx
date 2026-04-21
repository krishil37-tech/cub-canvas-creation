import { Heart } from "lucide-react";
import SectionPage from "./SectionPage";
import WhyChooseUsAdminSection from "@/components/admin/sections/WhyChooseUsAdminSection";

export default function WhyChooseUsPage() {
  return (
    <SectionPage icon={Heart} title="Why Choose Us" subtitle="More Than a School">
      <WhyChooseUsAdminSection />
    </SectionPage>
  );
}
