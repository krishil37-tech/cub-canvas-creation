import { Calendar } from "lucide-react";
import SectionPage from "./SectionPage";
import EventsAdminSection from "@/components/admin/sections/EventsAdminSection";

export default function EventsPage() {
  return (
    <SectionPage icon={Calendar} title="School Events" subtitle="Upcoming & Past Events">
      <EventsAdminSection />
    </SectionPage>
  );
}
