import { useEffect } from "react";
import Navbar from "@/components/Navbar";
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
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    const loadTheme = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("section", "settings")
        .eq("key", "theme")
        .maybeSingle();
      if (data?.value === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    loadTheme();
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />
      <main>
        <HeroSection />
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
