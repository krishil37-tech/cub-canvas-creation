import { MessageCircle } from "lucide-react";
import SectionPage from "./SectionPage";
import ChatbotAdminSection from "@/components/admin/sections/ChatbotAdminSection";

export default function ChatbotPage() {
  return (
    <SectionPage icon={MessageCircle} title="Chatbot" subtitle="Floating chat widget settings">
      <ChatbotAdminSection />
    </SectionPage>
  );
}
