import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Adventure } from "@/types/adventure";
import { slides, adventures, culinaryAdventures, culturalAdventures } from "@/data/mockData";

interface HeroCarouselProps {
  onSelectAdventure: (adventure: Adventure) => void;
}

export function HeroCarousel({ onSelectAdventure }: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const allAdventures = [...adventures, ...culinaryAdventures, ...culturalAdventures];

  return (
    <section className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-xl">
      <div ref={emblaRef} className="overflow-hidden rounded-2xl">
        <div className="flex">
          {slides.map((slide) => {
            const linkedAdventure = slide.adventureId != null
              ? allAdventures.find((a) => a.id === slide.adventureId) ?? null
              : null;
            return (
              <div
                key={slide.id}
                className={`relative flex-none w-full ${linkedAdventure ? "cursor-pointer" : ""}`}
                style={{ height: "clamp(220px, 45vw, 380px)" }}
                onClick={() => linkedAdventure && onSelectAdventure(linkedAdventure)}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }}
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                  >
                    {slide.icon}
                    {slide.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <h2 className="text-white font-bold text-base leading-tight drop-shadow">{slide.title}</h2>
                  <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {slide.location}
                  </p>
                  <p className="text-white/70 text-xs mt-1 line-clamp-2">{slide.description}</p>
                  {linkedAdventure && (
                    <span
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                    >
                      Toque para ver detalhes
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
      >
        <ChevronRight size={18} className="text-white" />
      </button>
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="transition-all rounded-full"
            style={{
              width: i === selectedIndex ? "20px" : "8px",
              height: "8px",
              background: i === selectedIndex ? "hsl(var(--matrip-accent))" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
