import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProgramsSection from "@/components/ProgramsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AdmissionsSection from "@/components/AdmissionsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <WhyChooseUs />
      <ProgramsSection />
      <GallerySection />
      <TestimonialsSection />
      <AdmissionsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
