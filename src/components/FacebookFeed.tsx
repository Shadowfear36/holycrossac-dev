"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/**
 * The parish's latest Facebook posts (including livestreams, which are posts), using
 * Facebook's official Page plugin. No login or API key needed.
 * - Only loads Facebook when the box scrolls near view (keeps the page fast and
 *   avoids loading Facebook for visitors who never reach it).
 * - Facebook's plugin is between 180 and 500px wide; it's sized to its container.
 * - If Facebook is blocked (privacy settings/extensions), a link to the page shows instead.
 */
export default function FacebookFeed({ height = 640 }: { height?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current!;
    let ro: ResizeObserver | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const measure = () => {
          const w = Math.round(Math.max(180, Math.min(500, box.clientWidth)));
          setWidth((prev) => (prev && Math.abs(prev - w) < 20 ? prev : w)); // avoid reloading for tiny changes
        };
        measure();
        ro = new ResizeObserver(measure);
        ro.observe(box);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(box);
    return () => {
      io.disconnect();
      ro?.disconnect();
    };
  }, []);

  const src =
    width &&
    `https://www.facebook.com/plugins/page.php?${new URLSearchParams({
      href: site.social.facebook,
      tabs: "timeline",
      width: String(width),
      height: String(height),
      small_header: "false",
      adapt_container_width: "true",
      hide_cover: "false",
      show_facepile: "false",
    })}`;

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-[500px]" style={{ height }}>
      {/* Shown until Facebook loads, and stays visible if Facebook is blocked */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-gold/30 paper p-6 text-center">
        <p className="font-display text-2xl">Holy Cross on Facebook</p>
        <a
          href={site.social.facebook}
          target="_blank"
          rel="noopener"
          className="font-semibold text-oxblood hover:underline"
        >
          See our latest posts →
        </a>
      </div>
      {src && (
        <iframe
          key={width}
          title="Latest posts from Holy Cross Anglican Church on Facebook"
          src={src}
          width={width}
          height={height}
          className="relative mx-auto block border-0"
          scrolling="no"
          allow="encrypted-media; picture-in-picture; web-share"
        />
      )}
    </div>
  );
}
