import { Menu } from "lucide-react";
import SectionPage from "./SectionPage";
import NavigationAdminSection from "@/components/admin/sections/NavigationAdminSection";

export default function NavigationPage() {
  return (
    <SectionPage
      icon={Menu}
      title="Navigation"
      subtitle="Edit the labels, targets, order, and visibility of links in the main navigation bar"
    >
      <NavigationAdminSection />
    </SectionPage>
  );
}
