import { useId } from "react";

/**
 * Jerusalem cross, the parish emblem from the old holycrossac.org
 * (public/images/jerusalem-cross.jpg, picture1.jpg): glossy red with a gold rim.
 * Redrawn as SVG so it stays sharp.
 *
 * variant="emblem" (default): red enamel + gold rim, as on the old site
 * variant="mono": a single color (currentColor), for placeholders and tinted uses
 */

export const CROSS_RECTS: [number, number, number, number][] = [
  // central cross potent
  [18, 3, 4, 34],
  [3, 18, 34, 4],
  [12.5, 3, 15, 3],
  [12.5, 34, 15, 3],
  [3, 12.5, 3, 15],
  [34, 12.5, 3, 15],
  // four small crosses
  ...[
    [10, 10],
    [30, 10],
    [10, 30],
    [30, 30],
  ].flatMap(([cx, cy]): [number, number, number, number][] => [
    [cx - 1, cy - 3.5, 2, 7],
    [cx - 3.5, cy - 1, 7, 2],
  ]),
];

export default function CrossMark({
  className = "",
  variant = "emblem",
}: {
  className?: string;
  variant?: "emblem" | "mono";
}) {
  const id = useId().replace(/:/g, "");

  if (variant === "mono") {
    return (
      <svg viewBox="0 0 40 40" aria-hidden className={className}>
        <g fill="currentColor">
          {CROSS_RECTS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="-1 -1 42 42" aria-hidden className={className}>
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dd9a" />
          <stop offset="0.45" stopColor="#c99a3e" />
          <stop offset="1" stopColor="#8a6421" />
        </linearGradient>
        <linearGradient id={`red-${id}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#e8343a" />
          <stop offset="0.5" stopColor="#c4161e" />
          <stop offset="1" stopColor="#8e0d13" />
        </linearGradient>
      </defs>
      {/* Gold rim: every piece drawn fat in gold first, so the outline is one continuous edge */}
      <g fill={`url(#gold-${id})`} stroke={`url(#gold-${id})`} strokeWidth="1.6" strokeLinejoin="miter">
        {CROSS_RECTS.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      {/* Red enamel on top */}
      <g fill={`url(#red-${id})`}>
        {CROSS_RECTS.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} />
        ))}
      </g>
    </svg>
  );
}
