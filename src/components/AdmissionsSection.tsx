import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

export default function AdmissionsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const label = get("admissions", "label", "Admissions 2026–27");
  const title = get("admissions", "title", "Admissions Open for Nursery – Class X");
  const description = get("admissions", "description", "Secure your child's future with a world-class education at IIRA International School, Vadodara. Limited seats available — apply today.");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parentName = String(fd.get("parent_name")).trim();
    const childName = String(fd.get("child_name")).trim();
    const email = String(fd.get("email")).trim();
    const phone = String(fd.get("phone")).trim();
    const program = String(fd.get("program")).trim();

    if (!parentName || !childName || !email || !phone || !program) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("admissions").insert({
      parent_name: parentName,
      child_name: childName,
      date_of_birth: String(fd.get("dob")).trim() || null,
      email,
      phone,
      program,
      notes: String(fd.get("notes")).trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = "w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl px-4 py-3.5 text-sm font-body text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 transition-all";

  return (
    <section id="admissions" ref={ref} className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="relative max-w-5xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <span className={`text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/70 font-body ${isVisible ? "animate-fade-in-up" : ""}`}>
              {label}
            </span>
            <h2 className={`mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold text-primary-foreground text-balance ${isVisible ? "animate-fade-in-up" : ""}`} style={{ lineHeight: "1.12", animationDelay: "0.1s" }}>
              {title}
            </h2>
            <p className={`mt-5 text-primary-foreground/80 font-body text-base leading-relaxed ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
              {description}
            </p>
            <div className={`mt-6 space-y-3 hidden lg:block ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
              {["No entrance test for Nursery & KG", "Scholarship for meritorious students", "Safe school bus transport available"].map((text) => (
                <div key={text} className="flex items-center gap-2 text-primary-foreground/80 text-sm font-body">
                  <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={`bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-primary-foreground/10 ${isVisible ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
                  <GraduationCap size={28} className="text-accent" />
                </div>
                <p className="font-body font-bold text-primary-foreground text-xl">Application Submitted!</p>
                <p className="text-sm text-primary-foreground/70 font-body mt-2 max-w-xs mx-auto">We'll contact you within 24 hours regarding the next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <input name="parent_name" type="text" placeholder="Parent / Guardian Name *" required maxLength={100} className={inputClass} />
                  <input name="child_name" type="text" placeholder="Child's Name *" required maxLength={100} className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <input name="dob" type="date" placeholder="Date of Birth" className={inputClass} />
                  <select name="program" required className={inputClass} defaultValue="">
                    <option value="" disabled>Select Program *</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class I-V">Class I-V</option>
                    <option value="Class VI-VIII">Class VI-VIII</option>
                    <option value="Class IX-X">Class IX-X</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <input name="email" type="email" placeholder="Email Address *" required maxLength={255} className={inputClass} />
                  <input name="phone" type="tel" placeholder="Phone Number *" required maxLength={15} className={inputClass} />
                </div>
                <textarea name="notes" placeholder="Any additional information (optional)" rows={3} maxLength={500} className={`${inputClass} resize-none`} />
                <button type="submit" disabled={loading} className="w-full bg-card text-foreground font-bold font-body py-4 rounded-xl text-base hover:brightness-105 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "Submitting…" : <><span>Submit Application</span> <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
