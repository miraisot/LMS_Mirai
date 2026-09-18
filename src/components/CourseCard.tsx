import Link from "next/link";
import { lessonLabels } from "@/components/glyphs";
import { countByType, countLessons, courseHoursLabel } from "@/lib/content";
import type { Course } from "@/lib/types";

export function CourseCard({
  course,
  index,
  completed = 0,
}: {
  course: Course;
  index: number;
  completed?: number;
}) {
  const total = countLessons(course);
  const types = countByType(course);
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const n = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/course/${course.id}`}
      className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0e1c] p-7 shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[#22d3ee]/40"
    >
      <div
        className="absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
        style={{ background: course.accent ?? "#00f0ff" }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between">
        <p className="font-display text-6xl leading-none text-[#22d3ee]/80">{n}</p>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-dust">
          {course.level ?? "Course"}
        </span>
      </div>
      <div className="relative mt-8">
        <h2 className="font-display text-[2rem] leading-[1.1] text-white">
          {course.title}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-soft">
          {course.subtitle ?? course.description}
        </p>
      </div>
      <div className="relative mt-auto flex items-end justify-between pt-10">
        <div className="space-y-2 text-xs uppercase tracking-[0.16em] text-dust">
          <p>
            {total} lessons · {courseHoursLabel(course)}
          </p>
          <p>
            {types.video} {lessonLabels.video.toLowerCase()}
            {" · "}
            {types.pdf} {lessonLabels.pdf.toLowerCase()}
            {" · "}
            {types.quiz} {lessonLabels.quiz.toLowerCase()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-white">{percent}%</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-dust">done</p>
        </div>
      </div>
      <div className="relative mt-5 h-[3px] overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#194cd1] to-[#00f0ff] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Link>
  );
}
