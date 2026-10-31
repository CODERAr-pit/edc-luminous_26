import { useRef } from "react";
import { event, logo, photos } from "@/data/luminous";
import { Diya } from "./Diya";
import { gsap, useGSAP, prefersReduced } from "./gsap";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo(
        ".hero-img",
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-in",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: "power3.out", delay: 0.4 },
      );
      gsap.to(".hero-img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section id="home" ref={ref} className="relative flex min-h-screen items-end overflow-hidden">
      <img
        src={photos.crowdEdc.src}
        alt={photos.crowdEdc.alt}
        className="hero-img absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/60 to-plum/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-plum/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pb-28">
        {/* Brand logo */}
        <div className="hero-in">
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-11 w-auto sm:h-14 md:h-16 object-contain"
          />
        </div>

        {/* Cohesive, baseline-aligned brand title with edition */}
        <h1 className="hero-in mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-brand font-bold uppercase tracking-[0.06em] text-ivory text-glow">
          <span className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none">{event.shortName}</span>
          <span className="font-brand text-[clamp(1.2rem,3.2vw,2.4rem)] font-semibold tracking-[0.14em] text-gold drop-shadow-[0_0_24px_rgba(230,160,68,0.55)]">
            {event.edition}
          </span>
        </h1>

        {/* Poetic Tagline */}
        <p className="hero-in mt-5 max-w-2xl font-serif text-2xl italic leading-relaxed text-ivory/90 sm:text-3xl">
          {event.tagline} <span className="font-normal not-italic text-gold">{event.subline}</span>
        </p>

        {/* Event details bottom bar with prominent traditional Diya */}
        <div className="hero-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-6 border-t border-ivory/15 pt-8 sm:gap-x-12">
          {/* Stylized Terracotta Diya with warm flame illumination */}
          <div className="flex items-center pr-2">
            <Diya className="w-20 sm:w-24" />
          </div>

          <span className="hidden h-10 w-px bg-ivory/15 sm:block" />

          {event.date && (
            <div className="flex flex-col">
              <span className="chapter-label !text-[0.62rem] uppercase tracking-widest text-gold/80 font-semibold">
                Date
              </span>
              <span className="mt-1 font-sans text-lg sm:text-xl font-bold tabular-nums text-ivory">
                {event.date}
              </span>
            </div>
          )}

          <span className="hidden h-10 w-px bg-ivory/15 md:block" />

          <div className="flex flex-col">
            <span className="chapter-label !text-[0.62rem] uppercase tracking-widest text-gold/80 font-semibold">
              Venue
            </span>
            <span className="mt-1 font-display text-lg sm:text-xl text-ivory">{event.venue}</span>
          </div>

          <span className="hidden h-10 w-px bg-ivory/15 md:block" />

          <div className="flex flex-col">
            <span className="chapter-label !text-[0.62rem] uppercase tracking-widest text-gold/80 font-semibold">
              Time
            </span>
            <span className="mt-1 font-sans text-base sm:text-lg font-semibold tabular-nums text-gold">
              {event.time}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
