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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />
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
      <Footer />
    </div>
  );
};

export default Index;
