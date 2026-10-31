import { cn } from "@/lib/utils";

interface DiyaProps {
  lit?: boolean;
  className?: string;
  flameClass?: string;
  glowClass?: string;
}

/**
 * Stylized festive Indian Diya (Mitti ka Diya).
 *
 * Designed with a soft, warm, cartoonish aesthetic matching the site's decorative theme:
 * - Smooth terracotta clay bowl with a gentle curved pedestal foot.
 * - Warm golden ghee/oil pool with liquid specular highlight.
 * - Elegant sculpted pinched spout where the wick sits.
 * - Soft festive dotted motif along the clay rim.
 * - Expressive living cartoon flame with golden vermilion layers and white-hot heart.
 * - Self-contained glow strictly localized to the flame (no upward spillage).
 */
export function Diya({ lit = true, className, flameClass }: DiyaProps) {
  return (
    <div
      className={cn("relative aspect-[180/135] w-24 shrink-0 select-none", className)}
      aria-label="Festive glowing clay diya"
      role="img"
    >
      <svg
        viewBox="0 0 180 135"
        className="relative h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle ground contact shadow */}
          <radialGradient id="diyaGnd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Warm terracotta clay gradient */}
          <linearGradient id="clayBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F27A45" />
            <stop offset="40%" stopColor="#DC5D28" />
            <stop offset="100%" stopColor="#9C3411" />
          </linearGradient>

          {/* Sculpted rim gradient with soft warm lighting */}
          <linearGradient id="clayRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA67A" />
            <stop offset="40%" stopColor="#F3743E" />
            <stop offset="100%" stopColor="#B43F18" />
          </linearGradient>

          {/* Inner bowl shadow */}
          <radialGradient id="bowlHollow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#541705" />
            <stop offset="70%" stopColor="#73230B" />
            <stop offset="100%" stopColor="#8F2D10" />
          </radialGradient>

          {/* Warm golden oil/ghee pool */}
          <radialGradient id="oilGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={lit ? "#FEF08A" : "#B45309"} />
            <stop offset="35%" stopColor={lit ? "#FBBF24" : "#85350A"} />
            <stop offset="80%" stopColor={lit ? "#D97706" : "#571D05"} />
            <stop offset="100%" stopColor="#3E1404" />
          </radialGradient>

          {/* Soft front rim highlight */}
          <linearGradient id="frontRimHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F3743E" />
            <stop offset="50%" stopColor="#FFBD99" />
            <stop offset="100%" stopColor="#F3743E" />
          </linearGradient>

          {/* Flame outer gradient */}
          <linearGradient id="flameOut" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="25%" stopColor="#F97316" />
            <stop offset="65%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Flame core gradient */}
          <linearGradient id="flameIn" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* 1. Soft Ground Shadow */}
        <ellipse cx="90" cy="126" rx="44" ry="5.5" fill="url(#diyaGnd)" />

        {/* 2. Foot Pedestal */}
        <path d="M 64 116 C 64 123, 116 123, 116 116 Z" fill="#78240A" />

        {/* 3. Main Terracotta Clay Bowl */}
        <path
          d="M 16 66 C 16 106, 52 120, 90 120 C 128 120, 164 106, 164 66 C 146 54, 118 48, 90 44 C 62 48, 34 54, 16 66 Z"
          fill="url(#clayBody)"
        />

        {/* 4. Upper Sculpted Rim with Smooth Rounded Spout Peak at Center */}
        <path
          d="M 16 66 C 36 54, 64 48, 86 44 C 88.5 43.5, 91.5 43.5, 94 44 C 116 48, 144 54, 164 66 C 148 78, 122 84, 90 84 C 58 84, 32 78, 16 66 Z"
          fill="url(#clayRimGrad)"
        />

        {/* 5. Inner Hollow Depth */}
        <path
          d="M 24 66 C 42 57, 68 52, 90 48 C 112 52, 138 57, 156 66 C 142 76, 118 80, 90 80 C 62 80, 38 76, 24 66 Z"
          fill="url(#bowlHollow)"
        />

        {/* 6. Golden Ghee / Oil Pool */}
        <ellipse cx="90" cy="67" rx="55" ry="10" fill="url(#oilGrad)" />
        {lit && (
          <ellipse cx="106" cy="66" rx="13" ry="2.2" fill="#FFFBEB" opacity="0.65" />
        )}

        {/* 7. Soft Front Rim Lip Curve (smooth 3D depth) */}
        <path
          d="M 16 66 C 36 76, 62 82, 90 82 C 118 82, 144 76, 164 66 C 148 74, 120 79, 90 79 C 60 79, 32 74, 16 66 Z"
          fill="url(#frontRimHighlight)"
          opacity="0.9"
        />

        {/* 8. Delicate Golden Festive Motif Dots */}
        <g fill="#FDE047" opacity="0.9">
          <circle cx="36" cy="71" r="1.5" />
          <circle cx="50" cy="75" r="1.6" />
          <circle cx="66" cy="77.5" r="1.7" />
          <circle cx="90" cy="79" r="1.8" />
          <circle cx="114" cy="77.5" r="1.7" />
          <circle cx="130" cy="75" r="1.6" />
          <circle cx="144" cy="71" r="1.5" />
        </g>

        {/* 9. Cotton Wick Resting right at Spout Peak */}
        <path d="M 90 54 Q 90 48 90 42" stroke="#381907" strokeWidth="3" strokeLinecap="round" />
        {lit && (
          <>
            <circle cx="90" cy="41" r="2.2" fill="#DC2626" />
            <circle cx="90" cy="41" r="1.2" fill="#FEF08A" />
          </>
        )}

        {/* 10. Cartoon Flame (Self-contained warm glow strictly localized to flame) */}
        {lit && (
          <g
            className={cn("diya-flame", flameClass)}
            style={{
              transformOrigin: "90px 42px",
              animation: "diya-flame-flicker 2.4s ease-in-out infinite",
            }}
          >
            {/* Outer Soft Teardrop Flame */}
            <path
              d="M 90 4 C 107 18, 115 31, 109 40 C 103 47, 77 47, 71 40 C 65 31, 73 18, 90 4 Z"
              fill="url(#flameOut)"
            />

            {/* Inner Warm Glow Core */}
            <path
              d="M 90 14 C 100 23, 105 32, 101 38 C 97 43, 83 43, 79 38 C 75 32, 80 23, 90 14 Z"
              fill="url(#flameIn)"
              style={{
                transformOrigin: "90px 42px",
                animation: "diya-core-flicker 1.8s ease-in-out infinite alternate",
              }}
            />

            {/* Soft Glowing White-Cream Heart */}
            <ellipse cx="90" cy="33" rx="4.5" ry="6.5" fill="#FFFFFF" opacity="0.95" />
          </g>
        )}
      </svg>
    </div>
  );
}
