import { site } from "@/content/site";

/**
 * The parish YouTube channel's uploads, newest first, using YouTube's own embed player.
 * Updates automatically when a new video is posted; no API key needed.
 * Uses youtube-nocookie.com (YouTube's privacy-enhanced mode) and loads lazily.
 *
 * Behind the player sits a "Watch on YouTube" card: it shows while the player loads,
 * and stays visible if a browser blocks YouTube (strict tracking protection, ad blockers),
 * so the box is never just black.
 */
export default function YouTubeLatest({ className = "" }: { className?: string }) {
  const uploads = "UU" + site.social.youtubeChannelId.slice(2);
  return (
    <div className={`relative aspect-video w-full overflow-hidden border border-gold/30 bg-ink ${className}`}>
      <a
        href={site.social.youtube}
        target="_blank"
        rel="noopener"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-parchment"
      >
        <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#FF0000]" aria-hidden fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
        </svg>
        <span className="font-display text-2xl">Watch our videos on YouTube</span>
        <span className="text-sm text-gold-light underline underline-offset-4">youtube.com/@HolyCrossAnglicanChurch ↗</span>
      </a>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${uploads}`}
        title="Latest videos from Holy Cross Anglican Church on YouTube"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="relative h-full w-full border-0"
      />
    </div>
  );
}
