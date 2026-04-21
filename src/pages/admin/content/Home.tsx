import { Home } from "lucide-react";
import SectionPage from "./SectionPage";
import HomeAdminSection from "@/components/admin/sections/HomeAdminSection";

export default function HomePage() {
  return (
    <SectionPage icon={Home} title="Home" subtitle="Hero, Stats & CTA">
      <HomeAdminSection />
    </SectionPage>
  );
}
