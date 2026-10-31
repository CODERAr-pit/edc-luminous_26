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
        <img src={logo.src} alt={logo.alt} className="hero-in h-12 w-auto md:h-16" />
        <h1 className="hero-in mt-4 font-brand text-[clamp(2.4rem,6.5vw,5.2rem)] font-bold uppercase leading-[0.95] tracking-[0.06em] text-ivory text-glow">
          {event.shortName}
          <span className="ml-3 align-top font-sans text-[0.38em] font-medium not-italic tabular-nums text-gold tracking-normal">
            {event.edition}
          </span>
        </h1>
        <p className="hero-in mt-6 max-w-xl font-serif text-2xl italic text-ivory/85 md:text-3xl">
          {event.tagline} {event.subline}
        </p>
        <div className="hero-in mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ivory/15 pt-6">
          <Diya className="w-12" />
          {event.date && (
            <div>
              <p className="chapter-label !text-[0.6rem] text-ivory/50">Date</p>
              <p className="mt-1 font-sans text-lg font-semibold tabular-nums text-ivory">
                {event.date}
              </p>
            </div>
          )}
          <div>
            <p className="chapter-label !text-[0.6rem] text-ivory/50">Venue</p>
            <p className="mt-1 font-display text-lg text-ivory">{event.venue}</p>
          </div>
          <div>
            <p className="chapter-label !text-[0.6rem] text-ivory/50">Time</p>
            <p className="mt-1 font-sans text-base tabular-nums text-gold">{event.time}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
