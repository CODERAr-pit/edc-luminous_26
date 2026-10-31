import { cn } from "@/lib/utils";

interface DiyaProps {
  lit?: boolean;
  className?: string;
  flameClass?: string;
  glowClass?: string;
}

/**
 * Stylized festive Indian Diya (Mitti ka Diya) facing forward towards the viewer.
 *
 * Designed with a soft, warm, cartoonish aesthetic matching the site's decorative theme:
 * - Forward-facing perspective: pinched spout and flame sit in the foreground facing the viewer.
 * - Warm golden ghee/oil pool and inner clay rim resting behind the flame.
 * - Smooth terracotta clay bowl with a gentle curved pedestal foot.
 * - Delicate golden festive motif dots along the front rim.
 * - Expressive living cartoon flame with golden vermilion layers and white-hot heart.
 * - Self-contained glow strictly localized to the flame (no upward spillage).
 */
export function Diya({ lit = true, className, flameClass }: DiyaProps) {
  return (
    <div
      className={cn("relative aspect-[180/135] w-24 shrink-0 select-none", className)}
      aria-label="Festive glowing clay diya facing forward"
      role="img"
    >
      <svg
        viewBox="0 0 180 135"
        className="relative h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Ground Contact Shadow */}
          <radialGradient id="diyaGnd" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Warm Terracotta Clay Gradient */}
          <linearGradient id="clayBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F27A45" />
            <stop offset="45%" stop-color="#DC5D28" />
            <stop offset="100%" stopColor="#9C3411" />
          </linearGradient>

          {/* Clay Rear Rim (nestled behind opening) */}
          <linearGradient id="clayRear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B8441D" />
            <stop offset="100%" stopColor="#6E2207" />
          </linearGradient>

          {/* Inner Bowl Depth Shadow */}
          <radialGradient id="innerCavity" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#541705" />
            <stop offset="70%" stopColor="#73230B" />
            <stop offset="100%" stopColor="#8F2D10" />
          </radialGradient>

          {/* Warm Golden Oil/Ghee Pool */}
          <radialGradient id="oilPool" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={lit ? "#FEF08A" : "#B45309"} />
            <stop offset="35%" stopColor={lit ? "#FBBF24" : "#85350A"} />
            <stop offset="80%" stopColor={lit ? "#D97706" : "#571D05"} />
            <stop offset="100%" stopColor="#3E1404" />
          </radialGradient>

          {/* Front Rim Highlight (facing viewer) */}
          <linearGradient id="frontRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFBD99" />
            <stop offset="40%" stopColor="#F8824E" />
            <stop offset="100%" stopColor="#C2491C" />
          </linearGradient>

          {/* Flame Outer Gradient */}
          <linearGradient id="flameOut" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="25%" stopColor="#F97316" />
            <stop offset="65%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Flame Core Gradient */}
          <linearGradient id="flameIn" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* 1. Ground Shadow */}
        <ellipse cx="90" cy="125" rx="46" ry="5.5" fill="url(#diyaGnd)" />

        {/* 2. Foot Pedestal */}
        <path d="M 66 116 C 66 123, 114 123, 114 116 Z" fill="#78240A" />

        {/* 3. Rear Wall of Clay Bowl (Back of the opening) */}
        <path
          d="M 18 64 C 18 48, 50 42, 90 42 C 130 42, 162 48, 162 64 C 162 76, 130 84, 90 84 C 50 84, 18 76, 18 64 Z"
          fill="url(#clayRear)"
        />

        {/* 4. Inner Bowl Cavity Depth */}
        <ellipse cx="90" cy="63" rx="66" ry="17" fill="url(#innerCavity)" />

        {/* 5. Shimmering Oil/Ghee Pool */}
        <ellipse cx="90" cy="64" rx="56" ry="12" fill="url(#oilPool)" />
        {lit && (
          <ellipse cx="106" cy="62" rx="14" ry="2.5" fill="#FFFBEB" opacity="0.65" />
        )}

        {/* 6. Main Front Clay Bowl Body (Facing viewer) */}
        <path
          d="M 18 64 C 18 106, 52 120, 90 120 C 128 120, 162 106, 162 64 C 146 76, 118 82, 90 84 C 62 82, 34 76, 18 64 Z"
          fill="url(#clayBody)"
        />

        {/* 7. Sculpted Front Rim Lip with smooth, solid forward pinch */}
        <path
          d="M 18 64 C 36 74, 62 80, 80 82 C 84 84, 88 88, 90 88 C 92 88, 96 84, 100 82 C 118 80, 144 74, 162 64 C 146 76, 118 84, 98 86 C 94 88, 92 90, 90 90 C 88 90, 86 88, 82 86 C 62 84, 34 76, 18 64 Z"
          fill="url(#frontRim)"
        />

        {/* 8. Decorative Motif Dots along the front rim */}
        <g fill="#FDE047" opacity="0.9">
          <circle cx="34" cy="68" r="1.5" />
          <circle cx="50" cy="74" r="1.6" />
          <circle cx="68" cy="78" r="1.7" />
          <circle cx="112" cy="78" r="1.7" />
          <circle cx="130" cy="74" r="1.6" />
          <circle cx="146" cy="68" r="1.5" />
        </g>

        {/* 9. Cotton Wick emerging from the oil pool onto the front lip */}
        <path d="M 90 62 Q 90 70 90 76" stroke="#381907" strokeWidth="3" strokeLinecap="round" />
        {lit && (
          <>
            <circle cx="90" cy="73" r="2.2" fill="#DC2626" />
            <circle cx="90" cy="73" r="1.2" fill="#FEF08A" />
          </>
        )}

        {/* 10. Cartoon Living Flame rising from front wick facing the user */}
        {lit && (
          <g
            className={cn("diya-flame", flameClass)}
            style={{
              transformOrigin: "90px 73px",
              animation: "diya-flame-flicker 2.4s ease-in-out infinite",
            }}
          >
            {/* Outer Soft Teardrop Flame */}
            <path
              d="M 90 12 C 112 33, 120 52, 113 65 C 106 75, 74 75, 67 65 C 60 52, 68 33, 90 12 Z"
              fill="url(#flameOut)"
            />

            {/* Inner Warm Glow Core */}
            <path
              d="M 90 26 C 102 40, 107 53, 102 61 C 97 68, 83 68, 78 61 C 73 53, 78 40, 90 26 Z"
              fill="url(#flameIn)"
              style={{
                transformOrigin: "90px 73px",
                animation: "diya-core-flicker 1.8s ease-in-out infinite alternate",
              }}
            />

            {/* Soft Glowing White Heart */}
            <ellipse cx="90" cy="54" rx="5" ry="7.5" fill="#FFFFFF" opacity="0.95" />
          </g>
        )}
      </svg>
    </div>
  );
}
