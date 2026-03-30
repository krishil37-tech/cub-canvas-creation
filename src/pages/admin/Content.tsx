import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Home, Heart, Sparkles, Trophy, Calendar, Users, GraduationCap,
  Image, Star, BookOpen, School, FileText, HelpCircle, MapPin, Share2,
} from "lucide-react";

import HomeAdminSection from "@/components/admin/sections/HomeAdminSection";
import WhyChooseUsAdminSection from "@/components/admin/sections/WhyChooseUsAdminSection";
import SpecialtiesAdminSection from "@/components/admin/sections/SpecialtiesAdminSection";
import AchievementsAdminSection from "@/components/admin/sections/AchievementsAdminSection";
import EventsAdminSection from "@/components/admin/sections/EventsAdminSection";
import LeadershipAdminSection from "@/components/admin/sections/LeadershipAdminSection";
import EducatorsAdminSection from "@/components/admin/sections/EducatorsAdminSection";
import GalleryAdminSection from "@/components/admin/sections/GalleryAdminSection";
import TestimonialsAdminSection from "@/components/admin/sections/TestimonialsAdminSection";
import BlogsAdminSection from "@/components/admin/sections/BlogsAdminSection";
import AdmissionsAdminSection from "@/components/admin/sections/AdmissionsAdminSection";
import ResourcesAdminSection from "@/components/admin/sections/ResourcesAdminSection";
import FAQAdminSection from "@/components/admin/sections/FAQAdminSection";
import ContactAdminSection from "@/components/admin/sections/ContactAdminSection";
import SocialLinksAdminSection from "@/components/admin/sections/SocialLinksAdminSection";

const sections = [
  { id: "home", label: "Home", subtitle: "Hero, Stats & CTA", icon: Home, Component: HomeAdminSection },
  { id: "why", label: "Why Choose Us", subtitle: "More Than a School", icon: Heart, Component: WhyChooseUsAdminSection },
  { id: "specialties", label: "Our Specialties", subtitle: "What Makes Us Special", icon: Sparkles, Component: SpecialtiesAdminSection },
  { id: "achievements", label: "Our Achievements", subtitle: "A Tradition of Excellence", icon: Trophy, Component: AchievementsAdminSection },
  { id: "events", label: "School Events", subtitle: "Upcoming & Past Events", icon: Calendar, Component: EventsAdminSection },
  { id: "leadership", label: "Our Pillars", subtitle: "Meet Our Leadership", icon: Users, Component: LeadershipAdminSection },
  { id: "educators", label: "Our Educators", subtitle: "Meet Our Teachers", icon: GraduationCap, Component: EducatorsAdminSection },
  { id: "gallery", label: "Gallery", subtitle: "Campus Life", icon: Image, Component: GalleryAdminSection },
  { id: "testimonials", label: "Testimonials", subtitle: "What People Say", icon: Star, Component: TestimonialsAdminSection },
  { id: "blogs", label: "Community Blogs", subtitle: "Voices from IIRA", icon: BookOpen, Component: BlogsAdminSection },
  { id: "admissions", label: "Admissions", subtitle: "Enrollment Information", icon: School, Component: AdmissionsAdminSection },
  { id: "resources", label: "Resources", subtitle: "Downloads & Documents", icon: FileText, Component: ResourcesAdminSection },
  { id: "faq", label: "FAQ", subtitle: "Frequently Asked Questions", icon: HelpCircle, Component: FAQAdminSection },
  { id: "contact", label: "Contact", subtitle: "Address, Phone & Social", icon: MapPin, Component: ContactAdminSection },
  { id: "social", label: "Social Media", subtitle: "Platform Links", icon: Share2, Component: SocialLinksAdminSection },
];

export default function Content() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Website Content</h1>
      <p className="text-sm text-muted-foreground font-body mb-6">Manage all sections of your website from here. Click a section to expand and edit.</p>

      <Accordion type="single" collapsible className="space-y-2">
        {sections.map(({ id, label, subtitle, icon: Icon, Component }) => (
          <AccordionItem key={id} value={id} className="border border-border rounded-xl overflow-hidden bg-card px-0">
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground font-body">{subtitle}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <Component />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
