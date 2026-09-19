"use client";

import { toYouTubeEmbed } from "@/lib/youtube";
import type { Lesson } from "@/lib/types";

export function VideoLesson({ lesson }: { lesson: Lesson }) {
  const embed = lesson.url ? toYouTubeEmbed(lesson.url) : null;

  if (!embed) {
    return (
      <div className="rounded-3xl border border-line bg-paper-2 p-8">
        <p className="font-display text-2xl">This how-to has no usable link.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Add a YouTube URL on the lesson in <code>data/courses.json</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] bg-black shadow-[0_0_0_1.5px_#00b4c859,0_0_40px_6px_#00b4c81f]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-white/45">
        <span>How-to stage</span>
        <span>YouTube</span>
      </div>
      <div className="relative aspect-video bg-black">
        <iframe
          src={embed}
          title={lesson.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
