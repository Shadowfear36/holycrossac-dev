import Photo from "./Photo";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  photo?: string;
  photoHint?: string;
};

/** Banner used at the top of interior pages. */
export default function PageHero({ eyebrow, title, intro, photo, photoHint }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {photo && (
        <Photo
          name={photo}
          alt=""
          hint={photoHint}
          priority
          className="absolute inset-0 -z-10 h-full w-full opacity-45"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pb-20 md:pt-32">
        {eyebrow && <p className="eyebrow mb-3 text-gold-light">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl text-parchment md:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-parchment/85">{intro}</p>}
      </div>
    </section>
  );
}
