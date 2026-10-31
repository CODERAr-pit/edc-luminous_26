import { cn } from "@/lib/utils";

interface DiyaProps {
  lit?: boolean;
  className?: string;
  flameClass?: string;
  glowClass?: string;
}

/**
 * Traditional Indian Terracotta Diya (Mitti ka Diya).
 *
 * Detailed earthenware craftsmanship featuring:
 * - Handcrafted clay silhouette with graceful curves and pedestal foot.
 * - Traditional fluted decorative scallops along the clay body.
 * - Sculpted rim with pinched front lip / spout where the wick rests.
 * - Hollow bowl holding an authentic pool of melted oil/ghee with liquid specular highlight.
 * - Twisted cotton wick (Baati) with glowing ember tip.
 * - Multi-layer living flame: electric blue combustion base, incandescent white core,
 *   vibrant golden-orange teardrop, fiery outer aura, and drifting micro-sparks.
 * - Warm pulsating ambient illumination casting light onto the ground and surrounding space.
 */
export function Diya({ lit = true, className, flameClass, glowClass }: DiyaProps) {
  return (
    <div
      className={cn("relative aspect-[200/145] w-24 shrink-0 select-none", className)}
      aria-label="Traditional glowing clay diya"
      role="img"
    >
      {lit && (
        <>
          {/* Layer 1: Ambient Wide Warm Radial Glow */}
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-[30%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full",
              glowClass,
            )}
            style={{
              background:
                "radial-gradient(circle at center, rgba(255, 196, 64, 0.45) 0%, rgba(245, 124, 0, 0.22) 34%, rgba(225, 70, 10, 0.08) 58%, transparent 74%)",
              animation: "diya-glow-pulse 2.5s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          {/* Layer 2: Core Radiant Halo */}
          <div
            className="pointer-events-none absolute left-1/2 top-[30%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[6px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255, 240, 180, 0.75) 0%, rgba(255, 170, 30, 0.45) 45%, transparent 75%)",
              animation: "diya-glow-pulse 1.8s ease-in-out infinite reverse",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <svg
        viewBox="0 0 200 145"
        className="relative h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Terracotta Clay Body Gradient */}
          <linearGradient id="clayOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d96a3b" />
            <stop offset="30%" stopColor="#b34822" />
            <stop offset="70%" stopColor="#7a2a12" />
            <stop offset="100%" stopColor="#4d1607" />
          </linearGradient>

          {/* Terracotta Rim with Warm Golden Highlight from Flame */}
          <linearGradient id="clayRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#913316" />
            <stop offset="25%" stopColor="#d96a3b" />
            <stop offset="50%" stopColor={lit ? "#ffb347" : "#b34822"} />
            <stop offset="75%" stopColor="#d96a3b" />
            <stop offset="100%" stopColor="#913316" />
          </linearGradient>

          {/* Inner Hollow Clay Shadow */}
          <radialGradient id="innerBowl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a1506" />
            <stop offset="70%" stopColor="#691f09" />
            <stop offset="100%" stopColor="#8d2e11" />
          </radialGradient>

          {/* Golden Ghee / Oil Pool with Warm Reflection */}
          <radialGradient id="gheePool" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={lit ? "#ffe082" : "#8d4f1c"} />
            <stop offset="40%" stopColor={lit ? "#ffb300" : "#6d3b12"} />
            <stop offset="80%" stopColor={lit ? "#e65100" : "#4a2408"} />
            <stop offset="100%" stopColor="#2e1403" />
          </radialGradient>

          {/* Flame Gradient - Main Body */}
          <linearGradient id="flameMainGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#d84315" />
            <stop offset="25%" stopColor="#f4511e" />
            <stop offset="55%" stopColor="#ff9800" />
            <stop offset="85%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Flame Core Gradient - Incandescent */}
          <linearGradient id="flameCoreGrad" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#ff9800" />
            <stop offset="45%" stopColor="#ffeb3b" />
            <stop offset="90%" stopColor="#ffffff" />
          </linearGradient>

          {/* Flame Base - Blue Combustion */}
          <radialGradient id="flameBlueBase" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#3d5afe" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#651fff" stopOpacity="0" />
          </radialGradient>

          {/* Filter for Ember / Wick Glow */}
          <filter id="emberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Ground Cast Shadow */}
          <radialGradient id="diyaFloorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.65)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 1. Ground Cast Shadow */}
        <ellipse cx="100" cy="136" rx="66" ry="9" fill="url(#diyaFloorShadow)" />

        {/* 2. Diya Pedestal Foot */}
        <ellipse cx="100" cy="128" rx="36" ry="8" fill="#5c1d0a" />
        <ellipse cx="100" cy="127" rx="33" ry="6.5" fill="#872c10" />

        {/* 3. Main Terracotta Clay Bowl */}
        <path
          d="M20 74 C22 108 58 130 100 130 C142 130 178 108 180 74 C165 60 135 67 100 62 C65 67 35 60 20 74 Z"
          fill="url(#clayOuter)"
        />

        {/* Decorative carved flutes on clay surface */}
        <g stroke="#5c1c09" strokeWidth="1.2" opacity="0.45" fill="none">
          <path d="M45 86 C55 106 72 122 92 128" />
          <path d="M68 84 C76 102 86 118 97 129" />
          <path d="M155 86 C145 106 128 122 108 128" />
          <path d="M132 84 C124 102 114 118 103 129" />
        </g>

        {/* 4. Sculpted Upper Rim */}
        <path
          d="M18 73 C30 58 65 64 94 56 C97 53 100 48 100 48 C100 48 103 53 106 56 C135 64 170 58 182 73 C168 88 138 82 100 84 C62 82 32 88 18 73 Z"
          fill="url(#clayRim)"
        />

        {/* Inner Bowl Depth */}
        <ellipse cx="100" cy="74" rx="70" ry="18" fill="url(#innerBowl)" />

        {/* 5. Ghee / Oil Pool with Shimmering Light */}
        <ellipse cx="100" cy="76" rx="58" ry="13.5" fill="url(#gheePool)" />
        {lit && (
          <>
            <ellipse
              cx="100"
              cy="74"
              rx="18"
              ry="4.5"
              fill="#fff9c4"
              opacity="0.75"
              style={{
                animation: "diya-core-flicker 1.8s ease-in-out infinite",
              }}
            />
            <ellipse cx="100" cy="75" rx="8" ry="2" fill="#ffffff" opacity="0.9" />
          </>
        )}

        {/* 6. Front Pinched Lip / Spout */}
        <path
          d="M93 57 C97 52 100 48 100 48 C100 48 103 52 107 57 C103 60 97 60 93 57 Z"
          fill="#d96a3b"
          stroke="#7a2a12"
          strokeWidth="0.8"
        />

        {/* 7. Twisted Cotton Wick (Baati) */}
        <path
          d="M100 74 C100.5 66 100 56 100 46"
          stroke="#422006"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M100 74 C100.3 66 100 56 100 46"
          stroke="#8d6e63"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Glowing Ember at Wick Tip */}
        {lit && <circle cx="100" cy="45" r="2.2" fill="#ff3d00" filter="url(#emberGlow)" />}

        {/* 8. Expressive Living Flame */}
        {lit && (
          <g
            className={cn(flameClass)}
            style={{
              transformOrigin: "100px 48px",
              animation: "diya-flame-flicker 2.4s ease-in-out infinite",
            }}
          >
            {/* Outer Warm Flame Halo */}
            <path
              d="M100 8 C112 24 120 38 115 47 C110 55 90 55 85 47 C80 38 88 24 100 8 Z"
              fill="rgba(255, 109, 0, 0.35)"
              filter="blur(2.5px)"
            />

            {/* Main Flame Teardrop */}
            <path
              d="M100 10 C109 25 116 38 112 47 C108 55 92 55 88 47 C84 38 91 25 100 10 Z"
              fill="url(#flameMainGrad)"
            />

            {/* Inner Vibrant Core */}
            <path
              d="M100 20 C105 30 109 38 107 45 C105 51 95 51 93 45 C91 38 95 30 100 20 Z"
              fill="url(#flameCoreGrad)"
              style={{
                transformOrigin: "100px 48px",
                animation: "diya-core-flicker 1.6s ease-in-out infinite alternate",
              }}
            />

            {/* White-Hot Heart */}
            <path
              d="M100 30 C103 36 105 42 103 46 C101 49 99 49 97 46 C95 42 97 36 100 30 Z"
              fill="#ffffff"
              opacity="0.95"
            />

            {/* Blue Combustion Base */}
            <path
              d="M91 47 C92 42 96 39 100 39 C104 39 108 42 109 47 C106 50 94 50 91 47 Z"
              fill="url(#flameBlueBase)"
            />

            {/* Rising Micro-Sparks */}
            <circle
              cx="99"
              cy="8"
              r="1.2"
              fill="#ffe082"
              style={{
                animation: "diya-spark-1 2.2s ease-out infinite",
              }}
            />
            <circle
              cx="102"
              cy="12"
              r="0.9"
              fill="#ffd54f"
              style={{
                animation: "diya-spark-2 2.8s ease-out 0.8s infinite",
              }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
