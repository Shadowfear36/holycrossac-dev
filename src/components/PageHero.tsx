import Photo from "./Photo";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  photo?: string;
  photoHint?: string;
  photoPosition?: string;
  /** Extra classes for the photo, e.g. a responsive crop: "object-[50%_55%]" */
  photoClassName?: string;
  /** Caption for the photo, shown small in the corner */
  caption?: string;
  /**
   * Photo across the top on its own, with the title below it on the dark band
   * (for group photos, so the title never covers anyone).
   * Default: photo dimmed behind the title.
   */
  stacked?: boolean;
};

/** Banner used at the top of interior pages. */
export default function PageHero({
  eyebrow,
  title,
  intro,
  photo,
  photoHint,
  photoPosition,
  photoClassName = "",
  caption,
  stacked,
}: Props) {
  const text = (
    <>
      {eyebrow && <p className="eyebrow mb-3 text-gold-light">{eyebrow}</p>}
      <h1 className="max-w-3xl text-5xl text-parchment md:text-6xl">{title}</h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-parchment/85">{intro}</p>}
    </>
  );

  if (stacked && photo) {
    return (
      <section className="bg-ink">
        <div className="relative">
          <Photo
            name={photo}
            alt={caption ?? ""}
            hint={photoHint}
            position={photoPosition}
            priority
            className={`block h-[280px] w-full sm:h-[420px] lg:aspect-[16/7] lg:h-auto ${photoClassName}`}
          />
          {/* the photo's bottom edge fades into the dark band with the title.
              Large screens keep a fixed 16:7 shape so the same part of the photo shows at any width. */}
          <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-ink to-transparent" />
          {caption && (
            <p className="absolute bottom-3 right-4 max-w-[60%] text-right text-xs italic text-parchment/80">{caption}</p>
          )}
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-6 md:pb-16">{text}</div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {photo && (
        <Photo
          name={photo}
          alt=""
          hint={photoHint}
          position={photoPosition}
          priority
          className={`absolute inset-0 -z-10 h-full w-full opacity-45 ${photoClassName}`}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pb-20 md:pt-32">{text}</div>
      {photo && caption && (
        <p className="absolute bottom-3 right-4 max-w-[60%] text-right text-xs italic text-parchment/70">{caption}</p>
      )}
    </section>
  );
}
