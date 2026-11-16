"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Gentle "fade up as it scrolls into view" for page content, site-wide.
 *
 * - Picks up headings, text blocks, cards, photos and quotes inside <main> automatically
 *   (add data-reveal to anything else that should animate; data-no-reveal to opt out).
 * - Anything already on screen when the page loads is left alone (no flash).
 * - Items in the same list/grid appear one after another.
 * - Off for "reduce motion", and without JavaScript everything simply shows.
 * Styles: "Scroll reveal" in globals.css.
 */
const TARGETS = [
  "h2",
  ".eyebrow",
  ".prose-church",
  "li",
  "figure",
  "blockquote",
  "article",
  "dl",
  "form",
  "[data-reveal]",
].join(",");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("main");
    if (!main) return;

    // Show anything whose top has reached the lower part of the screen, including things
    // scrolled straight past (fast flicks, in-page links), so nothing is left hidden.
    let pending: HTMLElement[] = [];
    let ticking = 0;
    const check = () => {
      ticking = 0;
      const line = window.innerHeight * 0.9;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          el.classList.add("reveal-in");
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!ticking) ticking = requestAnimationFrame(check);
    };

    // Wait a frame so the new page's content is in place after client-side navigation
    const raf = requestAnimationFrame(() => {
      const banner = main.querySelector("section"); // the page's top banner stays as is
      const all = Array.from(main.querySelectorAll<HTMLElement>(TARGETS));
      for (const el of all) {
        if (el.closest("[data-no-reveal]") || (banner && banner.contains(el))) continue;
        if (el.classList.contains("reveal-pending")) continue;
        // Only animate the outermost target (e.g. a card, not every line inside it)
        const parentTarget = el.parentElement?.closest(TARGETS);
        if (parentTarget && main.contains(parentTarget) && !(banner && banner.contains(parentTarget))) continue;
        // Already on screen at load: leave it visible
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) continue;

        // Stagger siblings in the same list/grid
        if (el.tagName === "LI" && el.parentElement) {
          const i = Array.prototype.indexOf.call(el.parentElement.children, el);
          el.style.setProperty("--reveal-delay", `${(i % 6) * 90}ms`);
        }
        el.classList.add("reveal-pending");
        pending.push(el);
      }
      if (pending.length) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(ticking);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
