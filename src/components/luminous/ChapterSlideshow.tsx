import { useState, useEffect, useRef } from "react";
import type { Media } from "@/data/luminous";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface SlideItem {
  media: Media;
  title: string;
  desc: string;
}

interface ChapterSlideshowProps {
  slides: SlideItem[];
  interval?: number; // ms, default 4500
  className?: string;
}

export function ChapterSlideshow({ slides, interval = 4500, className }: ChapterSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slideshow timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const stepTime = 50;
    const totalSteps = interval / stepTime;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 100 / totalSteps;
      });
    }, stepTime);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, interval, slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const activeSlide = slides[currentIndex];

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image Container */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/40 bg-slate shadow-xl">
        {slides.map((slide, idx) => (
          <img
            key={slide.media.src}
            src={slide.media.src}
            alt={slide.media.alt || slide.title}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out",
              idx === currentIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0 pointer-events-none",
            )}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        ))}

        {/* Gradient shadow for text readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-plum/90 via-plum/35 to-transparent p-5 pt-12">
          <p className="font-serif text-xl font-medium text-ivory drop-shadow-sm transition-all duration-300">
            {activeSlide?.title}
          </p>
          <p className="mt-0.5 text-xs text-ivory/80 drop-shadow-sm">{activeSlide?.desc}</p>
        </div>

        {/* Subtle timer progress line */}
        <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-ivory/15">
          <div
            className="h-full bg-gold transition-all duration-75 ease-linear shadow-flame"
            style={{ width: `${isPaused ? 100 : progress}%` }}
          />
        </div>

        {/* Previous / Next Arrow buttons on hover */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-plum/60 p-2 text-ivory/90 opacity-0 backdrop-blur transition-all duration-300 hover:bg-plum/90 hover:scale-110 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-plum/60 p-2 text-ivory/90 opacity-0 backdrop-blur transition-all duration-300 hover:bg-plum/90 hover:scale-110 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Top-right slide counter & pause indicator */}
        <div className="absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-plum/60 px-2.5 py-1 text-[0.65rem] font-medium tabular-nums text-ivory/85 backdrop-blur">
          <span>
            {currentIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="ml-1 opacity-70 hover:opacity-100"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
          </button>
        </div>
      </div>

      {/* Thumbnails Row */}
      {slides.length > 1 && (
        <div
          className={cn(
            "grid gap-2",
            slides.length === 2 && "grid-cols-2",
            slides.length === 3 && "grid-cols-3",
            slides.length === 4 && "grid-cols-4",
            slides.length === 5 && "grid-cols-5",
            slides.length >= 6 && "grid-cols-6",
          )}
          style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}
        >
          {slides.map((item, idx) => (
            <button
              key={item.media.src}
              type="button"
              onClick={() => goToSlide(idx)}
              className={cn(
                "group relative aspect-[4/3] w-full overflow-hidden rounded-lg border-2 transition-all duration-300",
                currentIndex === idx
                  ? "border-gold shadow-flame ring-1 ring-gold scale-[1.02]"
                  : "border-transparent opacity-65 hover:opacity-100",
              )}
              aria-label={`Go to slide: ${item.title}`}
            >
              <img
                src={item.media.src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
