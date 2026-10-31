import type { Media } from "@/data/luminous";
import { cn } from "@/lib/utils";

/** Renders real media when `src` is set, otherwise a clearly replaceable placeholder. */
export function MediaSlot({
  media: m,
  className,
  eager,
}: {
  media: Media | undefined;
  className?: string;
  eager?: boolean;
}) {
  const media: Media = m ?? { type: "image", src: "", alt: "", label: "Media" };
  if (media.src) {
    return media.type === "video" ? (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={media.src}
        poster={media.poster}
        muted
        loop
        autoPlay
        playsInline
        preload={eager ? "auto" : "none"}
        aria-label={media.alt}
      />
    ) : (
      <img
        className={cn("h-full w-full object-cover", className)}
        src={media.src}
        alt={media.alt}
        loading={eager ? "eager" : "lazy"}
      />
    );
  }
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-end overflow-hidden bg-slate p-4",
        className,
      )}
      role="img"
      aria-label={`Placeholder: ${media.label}`}
    >
      <div className="absolute inset-0 opacity-60 glow-gold [background-position:30%_80%] [background-size:140%_140%]" />
      <div className="absolute inset-3 border border-dashed border-gold/30" />
      <span className="relative chapter-label !text-[0.6rem] !tracking-[0.2em] text-ivory/70">
        {media.type === "video" ? "▶ " : "◻ "}
        {media.label}
      </span>
    </div>
  );
}
