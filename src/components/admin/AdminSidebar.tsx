import {
  LayoutDashboard, MessageSquare, GraduationCap, Star, Image, LogOut,
  Home, Heart, Sparkles, Trophy, Calendar, Users, BookOpen, School,
  FileText, HelpCircle, MapPin, Share2, MessageCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Inquiries", url: "/admin/inquiries", icon: MessageSquare },
  { title: "Admissions", url: "/admin/admissions", icon: GraduationCap },
  { title: "Testimonials", url: "/admin/testimonials", icon: Star },
  { title: "Images", url: "/admin/images", icon: Image },
  { title: "Chatbot Engagement", url: "/admin/chatbot-engagements", icon: MessageCircle },
];

const contentItems = [
  { title: "Home", url: "/admin/content/home", icon: Home },
  { title: "Why Choose Us", url: "/admin/content/why", icon: Heart },
  { title: "Our Specialties", url: "/admin/content/specialties", icon: Sparkles },
  { title: "Achievements", url: "/admin/content/achievements", icon: Trophy },
  { title: "School Events", url: "/admin/content/events", icon: Calendar },
  { title: "Our Pillars", url: "/admin/content/leadership", icon: Users },
  { title: "Our Educators", url: "/admin/content/educators", icon: GraduationCap },
  { title: "Gallery", url: "/admin/content/gallery", icon: Image },
  { title: "Testimonials", url: "/admin/content/testimonials", icon: Star },
  { title: "Community Blogs", url: "/admin/content/blogs", icon: BookOpen },
  { title: "Admissions Section", url: "/admin/content/admissions", icon: School },
  { title: "Resources", url: "/admin/content/resources", icon: FileText },
  { title: "FAQ", url: "/admin/content/faq", icon: HelpCircle },
  { title: "Contact", url: "/admin/content/contact", icon: MapPin },
  { title: "Social Media", url: "/admin/content/social", icon: Share2 },
  { title: "Chatbot", url: "/admin/content/chatbot", icon: MessageCircle },
];

interface Props {
  onSignOut: () => void;
}

export function AdminSidebar({ onSignOut }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-black text-[10px]">IC</span>
                </div>
                <span className="font-bold text-sm">IIRA Cubs Admin</span>
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Website Content</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} className="hover:bg-destructive/10 text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
