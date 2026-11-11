import Photo from "./Photo";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  photo?: string;
  photoHint?: string;
  photoPosition?: string;
  /** Extra classes for the photo, e.g. responsive crop: "object-[50%_55%] 2xl:object-[50%_38%]" */
  photoClassName?: string;
  /** Caption for the background photo, shown small in the corner */
  caption?: string;
  /** Push the title down so the top of the photo (e.g. people's faces) stays clear */
  titleLow?: boolean;
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
  titleLow,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {photo && (
        <Photo
          name={photo}
          alt=""
          hint={photoHint}
          position={photoPosition}
          priority
          className={`absolute inset-0 -z-10 h-full w-full ${titleLow ? "opacity-60" : "opacity-45"} ${photoClassName}`}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
      <div className={`mx-auto max-w-6xl px-6 ${titleLow ? "pb-12 pt-[330px] sm:pt-[270px] md:pb-14" : "pb-16 pt-24 md:pb-20 md:pt-32"}`}>
        {eyebrow && <p className="eyebrow mb-3 text-gold-light">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl text-parchment md:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-parchment/85">{intro}</p>}
      </div>
      {photo && caption && (
        <p className="absolute bottom-3 right-4 max-w-[60%] text-right text-xs italic text-parchment/70">{caption}</p>
      )}
    </section>
  );
}
