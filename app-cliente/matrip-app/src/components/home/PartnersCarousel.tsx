import { useState, useEffect, useRef } from "react";
import { partnerImages } from "@/data/mockData";

export function PartnersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let position = 0;

    const step = () => {
      if (!isPaused) {
        position -= 0.5;
        const halfWidth = el.scrollWidth / 2;
        if (Math.abs(position) >= halfWidth) {
          position = 0;
        }
        el.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-8 px-4 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
      <h3 className="text-lg font-bold italic text-center mb-6" style={{ color: "hsl(var(--foreground))" }}>
        Nossos Parceiros
      </h3>
      <div className="relative max-w-4xl mx-auto">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(var(--muted)), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(var(--muted)), transparent)" }} />
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex items-center gap-8 whitespace-nowrap"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {[...partnerImages, ...partnerImages].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Parceiro ${(i % partnerImages.length) + 1}`}
                className="w-16 h-16 object-contain shrink-0 rounded-full bg-white p-1 shadow-sm transition-transform duration-200 hover:scale-110 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
