import { Image } from "lucide-react";
import SectionPage from "./SectionPage";
import GalleryAdminSection from "@/components/admin/sections/GalleryAdminSection";

export default function GalleryPage() {
  return (
    <SectionPage icon={Image} title="Gallery" subtitle="Campus Life">
      <GalleryAdminSection />
    </SectionPage>
  );
}
