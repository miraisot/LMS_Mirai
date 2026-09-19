import Link from "next/link";
import { CourseGrid } from "@/components/ResumeLearning";
import { shortOutcome } from "@/lib/content";
import type { Course, Track } from "@/lib/types";

function coursesForTrack(track: Track, courses: Course[]) {
  return courses.filter((course) => course.trackId === track.id);
}

export function TrackSection({
  track,
  courses,
  compact = false,
}: {
  track: Track;
  courses: Course[];
  compact?: boolean;
}) {
  const trackCourses = coursesForTrack(track, courses);
  if (trackCourses.length === 0) return null;
  const accent = track.accent ?? "#00f0ff";

  return (
    <section>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Track
          </p>
          <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">
            {track.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
            {track.subtitle ?? track.description}
          </p>
        </div>
        {!compact ? (
          <Link
            href={`/track/${track.id}`}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#82cdd6] hover:text-white"
          >
            Open track →
          </Link>
        ) : null}
      </div>
      {track.outcomes && track.outcomes.length > 0 ? (
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {track.outcomes.map((outcome, index) => (
            <li
              key={outcome}
              className="rounded-2xl border px-4 py-4"
              style={{
                borderColor: `${accent}40`,
                background: `${accent}12`,
              }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ color: accent }}
              >
                {String(index + 1).padStart(2, "0")} · {shortOutcome(outcome)}
              </p>
              <p className="mt-2 text-sm leading-6 text-white">{outcome}</p>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="mt-8">
        <CourseGrid courses={trackCourses} />
      </div>
    </section>
  );
}

export function TrackLibrary({
  tracks,
  courses,
}: {
  tracks: Track[];
  courses: Course[];
}) {
  const leftover = courses.filter(
    (course) => !tracks.some((track) => track.id === course.trackId),
  );

  return (
    <div className="space-y-16">
      {tracks.map((track) => (
        <TrackSection key={track.id} track={track} courses={courses} />
      ))}
      {leftover.length > 0 ? (
        <section>
          <h2 className="font-display text-3xl text-white">More courses</h2>
          <div className="mt-8">
            <CourseGrid courses={leftover} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
