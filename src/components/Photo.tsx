import fs from "node:fs";
import path from "node:path";

const EXTS = ["jpg", "jpeg", "png", "webp", "avif"];

/** Finds /public/photos/<name>.<ext> at build time. */
function findPhoto(name: string): string | null {
  const dir = path.join(process.cwd(), "public", "photos");
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(dir, `${name}.${ext}`))) return `/photos/${name}.${ext}`;
  }
  return null;
}

type Props = {
  /** File name in /public/photos without extension, e.g. "hero" → hero.jpg */
  name: string;
  alt: string;
  className?: string;
  /** Shown on the placeholder so you know what photo belongs here */
  hint?: string;
  priority?: boolean;
  /** CSS object-position, to keep faces in frame when cropped (e.g. "50% 30%") */
  position?: string;
};

/**
 * Drop a file into /public/photos named `<name>.jpg` and it appears automatically.
 * Until then, a labelled placeholder is rendered.
 */
export default function Photo({ name, alt, className = "", hint, priority, position }: Props) {
  const src = findPhoto(name);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`object-cover ${className}`}
        style={position ? { objectPosition: position } : undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#3a2e27] via-[#5b2a2f] to-[#2b211c] ${className}`}
    >
      <svg aria-hidden viewBox="0 0 40 60" className="absolute h-2/3 opacity-10 text-gold-light">
        <path fill="currentColor" d="M16 0h8v18h16v8H24v34h-8V26H0v-8h16z" />
      </svg>
      {process.env.NODE_ENV !== "production" && (
        <span className="relative rounded bg-black/40 px-3 py-1.5 text-center text-xs text-white/80">
          📷 {hint ?? alt}
          <br />
          <code className="text-white/60">public/photos/{name}.jpg</code>
        </span>
      )}
    </div>
  );
}
