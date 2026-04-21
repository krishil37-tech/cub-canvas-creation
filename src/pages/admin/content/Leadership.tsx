import { Users } from "lucide-react";
import SectionPage from "./SectionPage";
import LeadershipAdminSection from "@/components/admin/sections/LeadershipAdminSection";

export default function LeadershipPage() {
  return (
    <SectionPage icon={Users} title="Our Pillars" subtitle="Meet Our Leadership">
      <LeadershipAdminSection />
    </SectionPage>
  );
}
