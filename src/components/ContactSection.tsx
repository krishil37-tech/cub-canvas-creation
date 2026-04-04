import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { get } = useSiteContent();

  const address = get("contact", "address", "Next to Siddheshwar Krishna, Near Earth Allyssum, Bhaili, Vadodara, Gujarat");
  const phone = get("contact", "phone", "+91 265-2650XXX");
  const email = get("contact", "email", "info@iira.co.in");
  const hours = get("contact", "hours", "Mon–Sat: 8:00 AM – 4:00 PM");
  const mapLink = get("contact", "map_link", "");

  const info = [
    { icon: MapPin, label: "Visit Us", value: address, href: mapLink || undefined },
    { icon: Phone, label: "Call Us", value: phone, href: `tel:${phone.replace(/[^0-9+]/g, "")}` },
    { icon: Mail, label: "Email Us", value: email, href: `mailto:${email}` },
    { icon: Clock, label: "Office Hours", value: hours },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const emailVal = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();

    if (!name || !emailVal || !message) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("inquiries").insert({
      parent_name: name,
      email: emailVal,
      message,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all";

  return (
    <section id="contact" ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Get in Touch</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            We'd Love to Hear From You
          </h2>
          <p className={`section-subtitle ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
            Have questions about admissions or want to schedule a campus visit? Reach out to us.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className={`lg:col-span-2 space-y-5 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-bold font-body text-sm text-foreground">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-muted-foreground font-body mt-0.5 hover:text-primary transition-colors inline-flex items-center gap-1">
                      {item.value} {item.href.startsWith("http") && <ExternalLink size={12} />}
                    </a>
                  ) : (
                    <div className="text-sm text-muted-foreground font-body mt-0.5">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className={`lg:col-span-3 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            <div className="card-elevated">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Send us a Message</h3>
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-accent" />
                  </div>
                  <p className="font-body font-bold text-foreground text-lg">Message Sent!</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="name" type="text" placeholder="Your Name *" required maxLength={100} className={inputClass} />
                    <input name="email" type="email" placeholder="Your Email *" required maxLength={255} className={inputClass} />
                  </div>
                  <textarea name="message" placeholder="Your Message *" rows={4} required maxLength={1000} className={`${inputClass} resize-none`} />
                  <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
                    {loading ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
