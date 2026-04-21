import { Trophy } from "lucide-react";
import SectionPage from "./SectionPage";
import AchievementsAdminSection from "@/components/admin/sections/AchievementsAdminSection";

export default function AchievementsPage() {
  return (
    <SectionPage icon={Trophy} title="Our Achievements" subtitle="A Tradition of Excellence">
      <AchievementsAdminSection />
    </SectionPage>
  );
}
