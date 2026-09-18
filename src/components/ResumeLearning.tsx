"use client";

import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { useProgress } from "@/hooks/useProgress";
import { firstLesson, flattenLessons, lessonHref } from "@/lib/content";
import { getCourseProgress, progressPercent } from "@/lib/progress";
import type { Course } from "@/lib/types";

export function ResumeLearning({ courses }: { courses: Course[] }) {
  const { map } = useProgress();

  const active = courses
    .map((course) => {
      const progress = getCourseProgress(map, course.id);
      const total = flattenLessons(course).length;
      const percent = progressPercent(progress.completedLessonIds.length, total);
      const lastId = progress.lastLessonId ?? firstLesson(course)?.id;
      const hasProgress =
        Boolean(progress.lastLessonId) ||
        progress.completedLessonIds.length > 0;
      if (!lastId || !hasProgress) return null;
      return { course, percent, lastId };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.percent - a.percent);

  if (active.length === 0) return null;
  const lead = active[0];

  return (
    <section className="rise rise-delay-2 rounded-[24px] border border-white/10 bg-[#0a0e1c] px-7 py-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#82cdd6]">
        Continue
      </p>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl text-white">{lead.course.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
            You are {lead.percent}% through. Pick the thread back up.
          </p>
        </div>
        <Link
          href={lessonHref(lead.course.id, lead.lastId)}
          className="ember-btn inline-flex h-12 items-center justify-center px-6 text-sm font-medium"
        >
          Resume lesson
        </Link>
      </div>
    </section>
  );
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  const { map } = useProgress();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {courses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          index={index}
          completed={getCourseProgress(map, course.id).completedLessonIds.length}
        />
      ))}
    </div>
  );
}
