import { cn } from "@/lib/utils";

/**
 * Terracotta diya drawn in SVG with a warm flickering flame and soft circular glow.
 *
 * Sizing & Glow:
 * - The ambient glow is a square (w-20 h-20), rounded-full container centered on the flame.
 * - The radial-gradient reaches 0% opacity (transparent) at 70% of radius, well inside
 *   the bounding box (which ends at 100%). This guarantees a 100% natural, smooth, rounded
 *   falloff with ZERO clipping or chopping on top, bottom, or sides.
 */
export function Diya({
  lit = true,
  className,
  flameClass,
  glowClass,
}: {
  lit?: boolean;
  className?: string;
  flameClass?: string;
  glowClass?: string;
}) {
  return (
    <div className={cn("relative aspect-[2/1.3] w-24 shrink-0", className)}>
      {lit && (
        <>
          {/* Soft, reduced, perfectly round ambient warm glow centered on the flame */}
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-[-15%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full",
              glowClass,
            )}
            style={{
              background:
                "radial-gradient(circle at center, oklch(0.85 0.15 75 / 0.35) 0%, oklch(0.78 0.13 60 / 0.14) 30%, oklch(0.70 0.10 50 / 0.03) 50%, transparent 68%)",
            }}
            aria-hidden="true"
          />

          {/* Flickering flame with subtle warm aura */}
          <div
            className={cn(
              "flame absolute left-1/2 top-[-38%] h-[55%] w-[18%] -translate-x-1/2 drop-shadow-[0_0_5px_oklch(0.88_0.15_75/0.65)]",
              flameClass,
            )}
          />
        </>
      )}

      <svg viewBox="0 0 200 130" className="relative h-full w-full">
        <defs>
          <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.55 0.13 45)" />
            <stop offset="1" stopColor="oklch(0.28 0.07 35)" />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="oklch(0.4 0.1 40)" />
            <stop offset="0.5" stopColor={lit ? "oklch(0.8 0.13 70)" : "oklch(0.5 0.1 45)"} />
            <stop offset="1" stopColor="oklch(0.4 0.1 40)" />
          </linearGradient>
        </defs>
        <path
          d="M10 40 Q100 140 190 40 Q170 30 130 34 L100 14 L70 34 Q30 30 10 40Z"
          fill="url(#clay)"
        />
        <path
          d="M10 40 Q30 30 70 34 L100 14 L130 34 Q170 30 190 40 Q100 56 10 40Z"
          fill="url(#rim)"
          opacity="0.9"
        />
        <path
          d="M60 110 Q100 128 140 110"
          stroke="oklch(0.22 0.05 30)"
          strokeWidth="6"
          fill="none"
        />
      </svg>
    </div>
  );
}
