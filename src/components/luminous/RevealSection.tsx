import { useRef, useState } from "react";
import { event, lightLogo } from "@/data/luminous";
import { RegisterButton } from "./RegisterButton";
import { Diya } from "./Diya";
import { DiwaliFireworks } from "./DiwaliFireworks";
import { gsap, useGSAP, prefersReduced } from "./gsap";

const TBA = "To be announced";

export function RevealSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "center center", scrub: 1 },
      });
      tl.fromTo(
        ".rv-ring",
        { scale: 0.4, opacity: 0, rotate: -60 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1 },
      )
        .fromTo(
          ".rv-word span",
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.6 },
          0.3,
        )
        .fromTo(
          ".rv-detail",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 },
          0.8,
        );
    },
    { scope: ref },
  );

  const [fireworksActive, setFireworksActive] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [showCelebrationBadge, setShowCelebrationBadge] = useState(false);
  const [isRangoliPulsing, setIsRangoliPulsing] = useState(false);
  const rangoliRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  const triggerFireworks = () => {
    if (rangoliRef.current) {
      const rect = rangoliRef.current.getBoundingClientRect();
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setFireworksActive(true);
    setTriggerCount((prev) => prev + 1);
    setShowCelebrationBadge(true);
    setIsRangoliPulsing(true);

    window.setTimeout(() => {
      setIsRangoliPulsing(false);
    }, 1200);

    window.setTimeout(() => {
      setShowCelebrationBadge(false);
    }, 5500);
  };

  const handleRangoliClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 380) {
      triggerFireworks();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const handleRangoliDoubleClick = () => {
    triggerFireworks();
  };

  const details = [
    { k: "Edition", v: event.edition || TBA },
    { k: "Time", v: event.time },
    { k: "Date", v: event.date || TBA },
    { k: "Venue", v: event.venue || TBA },
  ];

  return (
    <section
      id="register"
      ref={ref}
      className="section-light relative px-6 py-20 md:py-28 overflow-hidden"
    >
      {/* Full-screen Fireworks Canvas */}
      <DiwaliFireworks
        isActive={fireworksActive}
        triggerKey={triggerCount}
        origin={origin}
        onDone={() => setFireworksActive(false)}
      />

      {/* Floating Festive Toast (Easter Egg) */}
      {showCelebrationBadge && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[130] pointer-events-none w-[92vw] max-w-md animate-in fade-in slide-in-from-top-6 duration-700 ease-out">
          <div className="relative overflow-hidden rounded-2xl border border-gold/35 bg-plum/85 p-5 text-center shadow-[0_0_50px_rgba(230,160,68,0.35),0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            {/* Subtle background golden flare */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 left-1/2 h-28 w-44 -translate-x-1/2 rounded-full bg-gold/20 blur-2xl"
            />

            <div className="relative flex flex-col items-center">
              <span className="text-2xl drop-shadow-[0_0_14px_rgba(230,160,68,0.85)]">🪔</span>

              <h4 className="mt-2 font-brand text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-ivory">
                Happy Diwali from Team EDC
              </h4>

              <p className="mt-1 font-serif text-sm italic text-gold/90">
                May your night shine as bright as a thousand diyas ✨
              </p>

              <div className="mt-3 flex items-center justify-center gap-2.5">
                <span className="h-px w-6 bg-gold/30" />
                <span className="font-sans text-[0.62rem] font-medium tracking-[0.22em] uppercase text-ivory/60">
                  LUMINOUS 10.0 · NIT Durgapur
                </span>
                <span className="h-px w-6 bg-gold/30" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Rangoli artwork in responsive square with interactive fireworks easter egg */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div
              ref={rangoliRef}
              role="button"
              tabIndex={0}
              onClick={handleRangoliClick}
              onDoubleClick={handleRangoliDoubleClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerFireworks();
                }
              }}
              className={`rangoli-stage group relative w-full max-w-[340px] cursor-pointer select-none transition-all duration-500 sm:max-w-[420px] lg:max-w-[480px] hover:scale-[1.01] active:scale-[0.99] ${
                isRangoliPulsing
                  ? "scale-105 filter drop-shadow-[0_0_35px_rgba(230,160,68,0.7)]"
                  : ""
              }`}
            >
              {/* Expanding golden shockwave ring on trigger */}
              {isRangoliPulsing && (
                <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-gold/70 animate-ping" />
              )}
              <svg
                viewBox="0 0 400 400"
                aria-hidden="true"
                className="rv-ring rangoli-art pointer-events-none"
              >
                {/* outer lotus petals */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <g key={`o${i}`} transform={`rotate(${(i / 16) * 360} 200 200)`}>
                    <path
                      d="M200 32 C220 56 220 84 200 104 C180 84 180 56 200 32Z"
                      fill={i % 2 === 0 ? "var(--rangoli-blue)" : "var(--rangoli-red)"}
                      fillOpacity="0.18"
                      stroke={i % 2 === 0 ? "var(--rangoli-blue)" : "var(--rangoli-red)"}
                      strokeWidth="1.2"
                    />
                  </g>
                ))}
                {/* interleaved vermilion petals */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <g key={`v${i}`} transform={`rotate(${((i + 0.5) / 16) * 360} 200 200)`}>
                    <path
                      d="M200 44 C208 62 208 84 200 100 C192 84 192 62 200 44Z"
                      fill="var(--gold)"
                      fillOpacity="0.24"
                      stroke="var(--gold)"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                {/* dotted ring between the petal layers */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  return (
                    <circle
                      key={`d${i}`}
                      cx={200 + Math.cos(a) * 118}
                      cy={200 + Math.sin(a) * 118}
                      r="2.4"
                      fill="var(--gold)"
                    />
                  );
                })}
                {/* inner petal ring */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <g key={`i${i}`} transform={`rotate(${(i / 8) * 360 + 22.5} 200 200)`}>
                    <path
                      d="M200 132 C212 144 212 160 200 172 C188 160 188 144 200 132Z"
                      fill="var(--rangoli-blue)"
                      fillOpacity="0.25"
                      stroke="var(--rangoli-blue)"
                      strokeWidth="1"
                    />
                  </g>
                ))}
                {/* inner dot ring */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = ((i + 0.5) / 8) * Math.PI * 2;
                  return (
                    <circle
                      key={`id${i}`}
                      cx={200 + Math.cos(a) * 88}
                      cy={200 + Math.sin(a) * 88}
                      r="2.8"
                      fill="var(--rangoli-red)"
                    />
                  );
                })}
                {/* heart of the rangoli */}
                <circle
                  cx="200"
                  cy="200"
                  r="20"
                  fill="none"
                  stroke="var(--rangoli-blue)"
                  strokeWidth="1.2"
                />
                <circle cx="200" cy="200" r="12" fill="var(--rangoli-red)" opacity="0.65" />
                <circle cx="200" cy="200" r="4" fill="var(--gold)" />
                {/* fine outer rings with a dotted border */}
                <circle
                  cx="200"
                  cy="200"
                  r="188"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="0.5"
                  strokeDasharray="2 6"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="0.3"
                />
                {Array.from({ length: 32 }).map((_, i) => {
                  const a = (i / 32) * Math.PI * 2;
                  return (
                    <circle
                      key={`od${i}`}
                      cx={200 + Math.cos(a) * 188}
                      cy={200 + Math.sin(a) * 188}
                      r="0.9"
                      fill="var(--gold)"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right: Event Details & Brand Lockup */}
          <div className="relative z-10 flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            {/* Elegant brand lockup: EDC logo side-by-side with Diya flame */}
            <div className="flex items-center justify-center gap-5 lg:justify-start">
              <img
                src={lightLogo.src}
                alt={lightLogo.alt}
                width={1356}
                height={496}
                className="h-9 w-auto max-w-[170px] object-contain"
                loading="lazy"
              />
              <span className="h-6 w-px bg-gold/40" aria-hidden="true" />
              <Diya className="w-12 shrink-0" />
            </div>

            <p className="chapter-label mt-8 text-gold">Event details</p>
            <h2
              className="rv-word mt-3 max-w-full font-brand text-3xl font-bold uppercase leading-none tracking-[0.06em] sm:text-5xl md:text-6xl lg:text-7xl"
              aria-label={event.name}
            >
              <span className="inline-block">{event.shortName}</span>{" "}
              <span className="inline-block font-sans text-[0.55em] font-medium not-italic tabular-nums text-gold tracking-normal">
                {event.edition}
              </span>
            </h2>
            <p className="mt-4 font-serif text-[clamp(1.4rem,2.5vw,2.2rem)] italic text-gold">
              The next spark could be yours.
            </p>

            <dl className="mt-10 grid w-full max-w-2xl grid-cols-2 border-y border-border md:grid-cols-4">
              {details.map((d) => (
                <div
                  key={d.k}
                  className="rv-detail border-border px-4 py-5 text-left odd:border-r md:border-r md:last:border-r-0"
                >
                  <dt className="chapter-label !text-[0.6rem] text-muted-foreground">{d.k}</dt>
                  <dd className="mt-1.5 font-sans text-base tabular-nums text-foreground">{d.v}</dd>
                </div>
              ))}
            </dl>

            <div className="rv-detail mt-10">
              <div className="flex flex-col items-center gap-3 lg:items-start">
                {!event.registrationOpen && (
                  <span className="font-display text-xl text-gold">Coming soon</span>
                )}
                <RegisterButton className="h-11 px-8" />
                <p className="text-xs text-muted-foreground text-center lg:text-left">
                  Rangoli Competition Entry Fee:{" "}
                  <strong className="font-semibold text-foreground">₹100 per team</strong> · Teams
                  of 4
                </p>
                {!event.registrationOpen && (
                  <p className="max-w-xs text-xs text-muted-foreground text-center lg:text-left">
                    Registration opens soon. Follow EDC to be the first to know.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
