import Link from "next/link";
import CrossMark from "@/components/CrossMark";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <CrossMark className="h-14 w-14" />
      <h1 className="mt-6 text-5xl">Page not found</h1>
      <p className="mt-4 text-ink-soft">The page you&apos;re looking for has moved or no longer exists.</p>
      <Link href="/" className="mt-8 bg-oxblood px-7 py-3 text-xs font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark">
        Return home
      </Link>
    </section>
  );
}
