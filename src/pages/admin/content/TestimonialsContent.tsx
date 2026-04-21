import { Star } from "lucide-react";
import SectionPage from "./SectionPage";
import TestimonialsAdminSection from "@/components/admin/sections/TestimonialsAdminSection";

export default function TestimonialsContentPage() {
  return (
    <SectionPage icon={Star} title="Testimonials" subtitle="What People Say">
      <TestimonialsAdminSection />
    </SectionPage>
  );
}
