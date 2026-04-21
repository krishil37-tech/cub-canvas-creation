import { BookOpen } from "lucide-react";
import SectionPage from "./SectionPage";
import BlogsAdminSection from "@/components/admin/sections/BlogsAdminSection";

export default function BlogsPage() {
  return (
    <SectionPage icon={BookOpen} title="Community Blogs" subtitle="Voices from IIRA">
      <BlogsAdminSection />
    </SectionPage>
  );
}
