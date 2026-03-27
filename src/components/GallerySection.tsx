import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import whyChoose from "@/assets/why-choose.jpg";

type GalleryImage = {
  id: string;
  image_path: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
};

const fallbackImages = [
  { src: hero1, label: "Campus Life" },
  { src: hero2, label: "Classroom Fun" },
  { src: whyChoose, label: "Outdoor Learning" },
  { src: hero2, label: "Creative Play" },
  { src: hero1, label: "Celebrations" },
  { src: whyChoose, label: "Nature Walks" },
];

function getPublicUrl(path: string) {
  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal();
  const [images, setImages] = useState<{ src: string; label: string }[]>(fallbackImages);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setImages(data.map((img) => ({ src: getPublicUrl(img.image_path), label: img.label })));
        }
      });
  }, []);

  return (
    <section id="gallery" ref={ref} className="py-20 lg:py-28 bg-warm">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="text-center max-w-2xl mx-auto">
          <span className={`section-label ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>Gallery</span>
          <h2 className={`section-title mt-3 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
            Campus Life
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl aspect-[4/3] ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-primary-foreground font-body font-bold text-sm">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
