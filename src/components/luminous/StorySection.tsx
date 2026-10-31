import { useRef } from "react";
import { photos } from "@/data/luminous";
import { gsap, useGSAP, prefersReduced } from "./gsap";
import { ChapterSlideshow, type SlideItem } from "./ChapterSlideshow";

const INTRO_PHOTOS: SlideItem[] = [
  {
    media: photos.diyaSpiral,
    title: "Diya Spiral",
    desc: "Every flame placed by hand in a glowing courtyard motif",
  },
  {
    media: photos.introRangoliGroup,
    title: "Rangoli Circle",
    desc: "EDC members gathered around vibrant festival artwork",
  },
  {
    media: photos.introGroupGlow,
    title: "EDC Community",
    desc: "Togetherness and warmth in traditional festive attire",
  },
  {
    media: photos.introCelebrationGift,
    title: "Sweet Celebrations",
    desc: "Sharing joyful smiles and festival gifts",
  },
  {
    media: photos.introDiyaFormation,
    title: "Courtyard Diya Glow",
    desc: "Golden flame constellation lighting up the night",
  },
];

const PRELIM_PHOTOS: SlideItem[] = [
  {
    media: photos.prelimMentor,
    title: "Mentorship & Joy",
    desc: "EDC mentors guiding kids with care and warmth",
  },
  {
    media: photos.prelimGirl,
    title: "Young Artist",
    desc: "Carefully painting handcrafted clay diyas",
  },
  {
    media: photos.prelimBoy,
    title: "Focus & Craft",
    desc: "Brushing vibrant colours onto the earthenware",
  },
  {
    media: photos.prelimRings,
    title: "Intricate Detail",
    desc: "Concentric rings hand-painted with precision",
  },
  {
    media: photos.prelimPavilion,
    title: "The Workshop Pavilion",
    desc: "Pavilion filled with young creators and students",
  },
  {
    media: photos.prelimCheering,
    title: "Pure Celebration",
    desc: "Joyful smiles and hands raised in high spirits",
  },
];

const RANGOLI_PHOTOS: SlideItem[] = [
  {
    media: photos.rangoli,
    title: "Floral Rangoli Canvas",
    desc: "Intricate petals and vibrant powders surrounding a central flame",
  },
  {
    media: photos.rangoliCenterDiya,
    title: "Lit Diya Centerpiece",
    desc: "Five-wick painted diya glowing at the heart of the rangoli",
  },
  {
    media: photos.rangoliDisplay,
    title: "Handcrafted Diya Showcase",
    desc: "Student team presenting the collection of decorated diyas",
  },
  {
    media: photos.introRangoliGroup,
    title: "Artistry & Teamwork",
    desc: "College groups gathering around their vibrant floor creations",
  },
  {
    media: photos.introDiyaFormation,
    title: "Floor of Radiance",
    desc: "Glowing constellation of earthen diyas illuminating the campus",
  },
];

export function StorySection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.utils.toArray<HTMLElement>(".ch").forEach((el) => {
        gsap.fromTo(
          el.querySelector(".ch-media"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
        gsap.fromTo(
          el.querySelectorAll(".ch-text > *"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 65%" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section id="story" ref={ref} className="section-light relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="chapter-label">The story</p>
        <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95]">
          Ten editions. <span className="font-serif font-normal italic text-gold">One glow.</span>
        </h2>
      </div>

      <div className="mt-20 flex flex-col gap-28 md:gap-40">
        {/* Chapter 01 — Introduction */}
        <article className="ch mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-10">
          <div className="ch-media md:col-span-7">
            <ChapterSlideshow slides={INTRO_PHOTOS} interval={4500} />
          </div>
          <div className="ch-text md:col-span-5">
            <p className="chapter-label text-gold">Chapter 01 — Introduction</p>
            <h3 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              A celebration of{" "}
              <span className="font-serif font-normal italic text-gold">
                creativity, colours & community.
              </span>
            </h3>
            <div className="my-7 h-px w-16 bg-gold shadow-flame" />
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              LUMINOUS 10.0, an initiative by the Entrepreneurship Development Cell, NIT Durgapur,
              brings together artistic expression, teamwork, and festive spirit.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Beginning with Pre-Luminous and culminating in the main event, LUMINOUS invites teams
              to transform the floor into vibrant, theme-inspired designs through creativity and
              collaboration.
            </p>
          </div>
        </article>

        {/* Chapter 02 — Pre-Luminous · BMEP × EDC */}
        <article className="ch mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-10">
          <div className="ch-media md:col-span-7">
            <ChapterSlideshow slides={PRELIM_PHOTOS} interval={4500} />
          </div>

          <div className="ch-text md:col-span-5">
            <p className="chapter-label text-vermilion">Chapter 02 — Pre-Luminous · BMEP × EDC</p>
            <h3 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Diyas, coloured{" "}
              <span className="font-serif font-normal italic text-vermilion">by hand.</span>
            </h3>
            <div className="my-7 h-px w-16 bg-gold shadow-flame" />
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              In Pre-Luminous, run by BMEP together with EDC, participants colour and decorate diyas
              — each one becoming a small piece of art.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              The finished diyas are then sold to professors and campus members. The proceeds and
              diyas used for the activity bring warm support to local communities.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border/60 bg-ivory/40 px-3 py-1 font-medium text-foreground">
                BMEP × EDC Initiative
              </span>
            </div>
          </div>
        </article>

        {/* Chapter 03 — Luminous · Rangoli Competition */}
        <article className="ch mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-12 md:gap-14 md:px-10">
          <div className="ch-media md:col-span-7">
            <ChapterSlideshow slides={RANGOLI_PHOTOS} interval={4500} />
          </div>
          <div className="ch-text md:col-span-5">
            <p className="chapter-label text-antique">
              Chapter 03 — Luminous · Rangoli Competition
            </p>
            <h3 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              The ground{" "}
              <span className="font-serif font-normal italic text-antique">becomes a canvas.</span>
            </h3>
            <div className="my-7 h-px w-16 bg-gold shadow-flame" />
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              In Luminous, college students form groups and create intricate floral and geometric
              rangoli designs together across the campus floor.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              A panel of judges evaluates every vibrant creation, celebrating the spirit of Diwali
              and rewarding the most captivating artistry.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 font-medium text-foreground">
                Rangoli Entry Fee:{" "}
                <strong className="font-semibold text-gold">₹100 per team</strong>
              </span>
              <span className="rounded-full border border-border/60 bg-ivory/40 px-3 py-1 font-medium text-muted-foreground">
                Teams of 4
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
