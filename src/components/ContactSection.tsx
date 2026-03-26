import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const info = [
  { icon: MapPin, label: "Address", value: "Near Earth Allyssum, Bhaili, Vadodara, Gujarat" },
  { icon: Phone, label: "Phone", value: "+91 265-2650XXX" },
  { icon: Mail, label: "Email", value: "cubs@iira.co.in" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sat: 8:00 AM – 4:00 PM" },
];

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Get in Touch</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Contact Us
          </h2>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className={isVisible ? "animate-fade-in-left" : "opacity-0"} style={{ animationDelay: "0.15s" }}>
            <div className="space-y-6">
              {info.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold font-body text-sm text-foreground">{item.label}</div>
                    <div className="text-sm text-muted-foreground font-body mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className={isVisible ? "animate-fade-in-right" : "opacity-0"} style={{ animationDelay: "0.25s" }}>
            <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm shadow-foreground/5 border border-border">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Send us a Message</h3>
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-accent" />
                  </div>
                  <p className="font-body font-bold text-foreground">Thank you!</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const { error } = await supabase.from("inquiries").insert({
                      parent_name: String(formData.get("name")).trim(),
                      email: String(formData.get("email")).trim(),
                      message: String(formData.get("message")).trim(),
                    });
                    if (error) {
                      toast.error("Failed to send message. Please try again.");
                    } else {
                      setSubmitted(true);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    maxLength={100}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    required
                    maxLength={255}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    required
                    maxLength={1000}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground font-bold font-body py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Send Message
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
