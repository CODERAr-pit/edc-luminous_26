import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { chapters, event, logo } from "@/data/luminous";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "./RegisterButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const calculateActiveSection = () => {
      if (window.scrollY < 120) {
        return "home";
      }

      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY >= h - 160) {
        return "register";
      }

      const threshold = window.innerHeight * 0.35;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const chapter = chapters[i];
        if (!chapter) continue;
        const el = document.getElementById(chapter.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            return chapter.id;
          }
        }
      }

      return "home";
    };

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
      setProgress(h > 0 ? window.scrollY / h : 0);
      setActiveSection(calculateActiveSection());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && chapters.some((c) => c.id === hash)) {
        setActiveSection(hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3.5 py-3 transition-all duration-500 sm:px-6 sm:py-4 md:px-10 md:py-5",
          scrolled || open
            ? "bg-plum/95 backdrop-blur-md shadow-md"
            : "bg-plum/30 backdrop-blur-sm",
        )}
      >
        {/* Left — logo lockup */}
        <a
          href="#home"
          onClick={() => setActiveSection("home")}
          className="group flex min-w-0 shrink-0 items-center gap-2 text-ivory transition-opacity hover:opacity-95 sm:gap-3"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-6 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-7"
          />
          <div className="hidden shrink-0 items-baseline gap-1 min-[340px]:flex sm:gap-1.5">
            <span className="font-brand text-xs font-bold tracking-wider uppercase text-ivory transition-colors group-hover:text-gold sm:text-sm sm:tracking-[0.2em]">
              {event.shortName}
            </span>
            <span className="font-sans text-[0.62rem] font-semibold tabular-nums tracking-normal text-gold sm:text-[0.68rem]">
              {event.edition}
            </span>
          </div>
        </a>

        {/* Centre — nav links strictly centered in the viewport */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-6 md:flex lg:gap-8">
          {chapters.map((c) => {
            const isActive = activeSection === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={() => setActiveSection(c.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-brand text-[0.84rem] font-semibold uppercase tracking-[0.16em] transition-all duration-200 hover:text-gold hover:tracking-[0.2em]",
                  isActive ? "text-gold font-bold" : "text-ivory/80",
                )}
              >
                {c.label}
              </a>
            );
          })}
        </nav>

        {/* Right — register + mobile menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <RegisterButton
            className="h-9 shrink-0 px-3.5 text-xs font-semibold sm:h-10 sm:px-5 sm:text-sm tracking-wide shadow-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-ivory hover:bg-white/10 hover:text-gold md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-plum px-8 md:hidden">
          {chapters.map((c, i) => {
            const isActive = activeSection === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={() => {
                  setActiveSection(c.id);
                  setOpen(false);
                }}
                className={cn(
                  "font-brand text-3xl font-semibold uppercase tracking-wider transition-colors hover:text-gold",
                  isActive ? "text-gold font-bold" : "text-ivory",
                )}
              >
                <span className="mr-4 align-top font-sans text-xs text-gold">0{i + 1}</span>
                {c.label}
              </a>
            );
          })}
          <div className="mt-4 border-t border-ivory/10 pt-6">
            <RegisterButton className="h-12 w-full justify-center text-base font-semibold tracking-wide" />
          </div>
        </div>
      )}

      {/* illuminated progress line */}
      <div className="fixed left-4 top-1/2 z-50 hidden h-40 w-px -translate-y-1/2 bg-ivory/10 md:block">
        <div className="w-full bg-gold shadow-flame" style={{ height: `${progress * 100}%` }} />
      </div>
    </>
  );
}
