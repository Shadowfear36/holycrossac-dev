"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryPhoto } from "@/lib/gallery";

/**
 * Photo grid with a full-screen viewer.
 * Click a photo to open it; use the arrows (or ← → keys) to move between photos,
 * and Esc, the × button, or a click outside the photo to close.
 */
export default function Gallery({ photos, layout = "masonry" }: { photos: GalleryPhoto[]; layout?: "masonry" | "grid" }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      {layout === "masonry" ? (
        <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <li key={p.src} className="mb-5 break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Open photo: ${p.alt}`}>
                <span className="block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.thumb} alt={p.alt} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </span>
                {p.caption && <span className="mt-2 block font-display text-base italic text-stone">{p.caption}</span>}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button type="button" onClick={() => setOpen(i)} className="group block w-full overflow-hidden" aria-label={`Open photo: ${p.alt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.alt}
                  loading="lazy"
                  style={p.position ? { objectPosition: p.position } : undefined}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <figure className="flex max-h-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} className="max-h-[80vh] w-auto object-contain shadow-2xl" />
            <figcaption className="mt-4 min-h-6 text-center font-display text-lg italic text-parchment/85">
              {current.caption ?? ""}
              <span className="ml-3 font-sans text-xs not-italic text-parchment/50">
                {open! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 h-11 w-11 text-3xl leading-none text-parchment/80 hover:text-parchment">
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 text-4xl text-parchment/70 hover:text-parchment md:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 text-4xl text-parchment/70 hover:text-parchment md:right-6"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
