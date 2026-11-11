/**
 * Marks a spot where real content from the parish is still needed.
 * Nothing is invented. These boxes stay visible until the content is supplied.
 * Before launch, search the code for "<Needed" to make sure none remain.
 */
export default function Needed({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-2 border-dashed border-gold bg-gold/10 p-5 text-sm text-ink-soft ${className}`}>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-oxblood">Content needed</p>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
