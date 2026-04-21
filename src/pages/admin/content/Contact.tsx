import { MapPin } from "lucide-react";
import SectionPage from "./SectionPage";
import ContactAdminSection from "@/components/admin/sections/ContactAdminSection";

export default function ContactPage() {
  return (
    <SectionPage icon={MapPin} title="Contact" subtitle="Address, Phone & Social">
      <ContactAdminSection />
    </SectionPage>
  );
}
