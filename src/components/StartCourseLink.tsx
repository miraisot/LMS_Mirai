"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { firstLesson, flattenLessons, lessonHref } from "@/lib/content";
import { getCourseProgress } from "@/lib/progress";
import type { Course } from "@/lib/types";

export function StartCourseLink({ course }: { course: Course }) {
  const { map } = useProgress();
  const progress = getCourseProgress(map, course.id);
  const start = firstLesson(course);
  if (!start) return null;

  const resumeId = progress.lastLessonId ?? start.id;
  const started = progress.completedLessonIds.length > 0;
  const total = flattenLessons(course).length;
  const done = progress.completedLessonIds.length;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={lessonHref(course.id, resumeId)}
        className="ember-btn inline-flex h-12 items-center px-7 text-sm"
      >
        {started ? "Continue" : "Begin"}
      </Link>
      <p className="text-sm text-dust">
        {done} of {total} lessons marked
      </p>
    </div>
  );
}
