import { useEffect, useState } from "react";
import LiquidGlassNav from "@/components/LiquidGlassNav";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import WhyChooseUs from "@/components/WhyChooseUs";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import AchievementsSection from "@/components/AchievementsSection";
import EventsSection from "@/components/EventsSection";
import LeadershipSection from "@/components/LeadershipSection";
import EducatorsSection from "@/components/EducatorsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogsSection from "@/components/BlogsSection";
import AdmissionsSection from "@/components/AdmissionsSection";
import ResourcesSection from "@/components/ResourcesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatbotWidget from "@/components/ChatbotWidget";
import PageLoader from "@/components/PageLoader";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate theme from DB AFTER mount (localStorage is already applied
    // pre-mount by index.html). DB is the source of truth across devices.
    const loadTheme = async () => {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("value")
          .eq("section", "settings")
          .eq("key", "theme")
          .maybeSingle();
        if (data?.value === "dark") {
          document.documentElement.classList.add("dark");
          try { localStorage.setItem("iira-theme", "dark"); } catch {}
        } else if (data?.value === "light") {
          document.documentElement.classList.remove("dark");
          try { localStorage.setItem("iira-theme", "light"); } catch {}
        }
      } catch {}
    };
    loadTheme();

    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {loading && <PageLoader />}
      <WhatsAppButton />
      <ChatbotWidget />
      <main>
        <HeroSection />
        <LiquidGlassNav />
        <StatsBar />
        <WhyChooseUs />
        <SpecialtiesSection />
        <AchievementsSection />
        <EventsSection />
        <LeadershipSection />
        <EducatorsSection />
        <GallerySection />
        <TestimonialsSection />
        <BlogsSection />
        <AdmissionsSection />
        <ResourcesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
