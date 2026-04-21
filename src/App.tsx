import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminLayout from "./pages/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Inquiries from "./pages/admin/Inquiries.tsx";
import Admissions from "./pages/admin/Admissions.tsx";
import Testimonials from "./pages/admin/Testimonials.tsx";
import Images from "./pages/admin/Images.tsx";

import HomePage from "./pages/admin/content/Home.tsx";
import WhyChooseUsPage from "./pages/admin/content/WhyChooseUs.tsx";
import SpecialtiesPage from "./pages/admin/content/Specialties.tsx";
import AchievementsPage from "./pages/admin/content/Achievements.tsx";
import EventsPage from "./pages/admin/content/Events.tsx";
import LeadershipPage from "./pages/admin/content/Leadership.tsx";
import EducatorsPage from "./pages/admin/content/Educators.tsx";
import GalleryPage from "./pages/admin/content/Gallery.tsx";
import TestimonialsContentPage from "./pages/admin/content/TestimonialsContent.tsx";
import BlogsPage from "./pages/admin/content/Blogs.tsx";
import AdmissionsContentPage from "./pages/admin/content/AdmissionsContent.tsx";
import ResourcesPage from "./pages/admin/content/Resources.tsx";
import FAQPage from "./pages/admin/content/FAQ.tsx";
import ContactPage from "./pages/admin/content/Contact.tsx";
import SocialPage from "./pages/admin/content/Social.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="images" element={<Images />} />

            <Route path="content/home" element={<HomePage />} />
            <Route path="content/why" element={<WhyChooseUsPage />} />
            <Route path="content/specialties" element={<SpecialtiesPage />} />
            <Route path="content/achievements" element={<AchievementsPage />} />
            <Route path="content/events" element={<EventsPage />} />
            <Route path="content/leadership" element={<LeadershipPage />} />
            <Route path="content/educators" element={<EducatorsPage />} />
            <Route path="content/gallery" element={<GalleryPage />} />
            <Route path="content/testimonials" element={<TestimonialsContentPage />} />
            <Route path="content/blogs" element={<BlogsPage />} />
            <Route path="content/admissions" element={<AdmissionsContentPage />} />
            <Route path="content/resources" element={<ResourcesPage />} />
            <Route path="content/faq" element={<FAQPage />} />
            <Route path="content/contact" element={<ContactPage />} />
            <Route path="content/social" element={<SocialPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
