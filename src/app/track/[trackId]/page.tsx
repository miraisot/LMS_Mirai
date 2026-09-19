import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackSection } from "@/components/TrackLibrary";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getCoursesByTrack, getTrack, getTracks } from "@/lib/content";

type TrackParams = { trackId: string };

export function generateStaticParams() {
  return getTracks().map((track) => ({ trackId: track.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TrackParams>;
}): Promise<Metadata> {
  const { trackId } = await params;
  const track = getTrack(trackId);
  return {
    title: track?.title ?? "Track",
    description: track?.subtitle ?? track?.description,
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<TrackParams>;
}) {
  const { trackId } = await params;
  const track = getTrack(trackId);
  if (!track) notFound();

  const courses = getCoursesByTrack(track.id);

  return (
    <div className="paper-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10 lg:px-8">
        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#82cdd6] hover:text-white"
        >
          ← Library
        </Link>
        {track.description ? (
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink-soft">
            {track.description}
          </p>
        ) : null}
        <div className="mt-10">
          <TrackSection track={track} courses={courses} compact />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
