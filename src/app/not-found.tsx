import Link from "next/link";
import { SiteHeader } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <div className="paper-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#82cdd6]">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl text-white">
          That page is not in the library.
        </h1>
        <p className="mt-4 text-ink-soft">
          The course or lesson id does not match anything in the JSON catalog.
        </p>
        <Link
          href="/"
          className="ember-btn mt-8 inline-flex h-11 items-center px-6 text-sm"
        >
          Back to the library
        </Link>
      </main>
    </div>
  );
}
