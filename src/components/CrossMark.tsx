/**
 * Jerusalem cross, the emblem used on the old holycrossac.org
 * (public/images/jerusalem-cross.jpg). Redrawn as SVG so it stays sharp.
 */
export default function CrossMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <g fill="currentColor">
        {/* Central cross potent */}
        <rect x="18" y="3" width="4" height="34" />
        <rect x="3" y="18" width="34" height="4" />
        <rect x="12.5" y="3" width="15" height="3" />
        <rect x="12.5" y="34" width="15" height="3" />
        <rect x="3" y="12.5" width="3" height="15" />
        <rect x="34" y="12.5" width="3" height="15" />
        {/* Four small crosses */}
        {[
          [10, 10],
          [30, 10],
          [10, 30],
          [30, 30],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <rect x={cx - 1} y={cy - 3.5} width="2" height="7" />
            <rect x={cx - 3.5} y={cy - 1} width="7" height="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}
