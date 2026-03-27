import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function AdmissionsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { get } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const label = get("admissions", "label", "Admissions 2026–27");
  const title = get("admissions", "title", "Admissions Open for Playgroup – Sr. KG");
  const description = get("admissions", "description", "Give your child the gift of a joyful learning journey at IIRA Cubs Preschool. Limited seats available — enroll today.");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const { error } = await supabase.from("admissions").insert({
      parent_name: String(fd.get("parent_name")).trim(),
      child_name: String(fd.get("child_name")).trim(),
      date_of_birth: String(fd.get("dob")).trim() || null,
      email: String(fd.get("email")).trim(),
      phone: String(fd.get("phone")).trim(),
      program: String(fd.get("program")).trim(),
      notes: String(fd.get("notes")).trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = "w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-3 text-sm font-body text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 transition-shadow";

  return (
    <section id="admissions" ref={ref} className="py-20 lg:py-28 bg-primary">
      <div className="max-w-4xl mx-auto section-padding">
        <div className="text-center">
          <span className={`text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70 font-body ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {label}
          </span>
          <h2 className={`mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ lineHeight: "1.1", animationDelay: "0.1s" }}>
            {title}
          </h2>
          <p className={`mt-4 text-primary-foreground/80 font-body text-lg max-w-2xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
            {description}
          </p>
        </div>

        <div className={`mt-10 bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-primary-foreground/10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={24} className="text-primary-foreground" />
              </div>
              <p className="font-body font-bold text-primary-foreground text-lg">Application Submitted!</p>
              <p className="text-sm text-primary-foreground/70 font-body mt-1">We'll contact you shortly regarding the next steps.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="parent_name" type="text" placeholder="Parent / Guardian Name" required maxLength={100} className={inputClass} />
                <input name="child_name" type="text" placeholder="Child's Name" required maxLength={100} className={inputClass} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="dob" type="date" placeholder="Date of Birth" className={inputClass} />
                <select name="program" required className={inputClass}>
                  <option value="" disabled selected>Select Program</option>
                  <option value="Playgroup">Playgroup (1.5–2.5 yrs)</option>
                  <option value="Nursery">Nursery (2.5–3.5 yrs)</option>
                  <option value="Junior KG">Junior KG (3.5–4.5 yrs)</option>
                  <option value="Senior KG">Senior KG (4.5–5.5 yrs)</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="email" type="email" placeholder="Email Address" required maxLength={255} className={inputClass} />
                <input name="phone" type="tel" placeholder="Phone Number" required maxLength={15} className={inputClass} />
              </div>
              <textarea name="notes" placeholder="Any additional information (optional)" rows={3} maxLength={500} className={`${inputClass} resize-none`} />
              <button type="submit" disabled={loading} className="w-full bg-card text-foreground font-bold font-body py-3 rounded-xl text-lg hover:opacity-90 active:scale-[0.97] transition-all shadow-xl disabled:opacity-50">
                {loading ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
