import { useRef } from "react";
import { photos } from "@/data/luminous";
import { gsap, useGSAP, prefersReduced } from "./gsap";

const ITEMS = [
  {
    m: photos.crowdEdc,
    cls: "md:col-span-8 md:row-span-2 aspect-[3/2] md:aspect-auto",
    cap: "The whole family, around the letters we lit",
  },
  {
    m: photos.nabAerial,
    cls: "md:col-span-4 md:row-span-2 aspect-[2/3] md:aspect-auto",
    cap: "NAB from top with lit diyas",
  },
  {
    m: photos.introGroupGlow,
    cls: "md:col-span-4 aspect-[4/3] md:aspect-auto",
    cap: "Hearts, in flame",
  },
  {
    m: photos.nightEdcEmblem,
    cls: "md:col-span-4 aspect-[4/3] md:aspect-auto",
    cap: "Gathered around the EDC emblem",
  },
  {
    m: photos.diyaSpiral,
    cls: "md:col-span-4 aspect-[4/3] md:aspect-auto",
    cap: "Hands that light",
  },
];

export function MemoriesSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo(
        ".mem",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".mem-grid", start: "top 75%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section id="memories" ref={ref} className="relative bg-plum py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="chapter-label">Chapter 04 — Memories & people</p>
        <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95]">
          It's not just what you see.
          <br />
          <span className="font-serif font-normal italic text-gold">It's who you see it with.</span>
        </h2>

        <div className="mem-grid mt-16 grid gap-4 md:auto-rows-[18rem] md:grid-cols-12 md:gap-6">
          {ITEMS.map((it) => (
            <figure key={it.cap} className={`mem group relative overflow-hidden ${it.cls}`}>
              <img
                src={it.m.src}
                alt={it.m.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/90 to-transparent p-5 text-sm text-ivory/80">
                {it.cap}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
