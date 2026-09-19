import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { StartCourseLink } from "@/components/StartCourseLink";
import { lessonGlyph, lessonLabels } from "@/components/glyphs";
import {
  countByType,
  countLessons,
  courseHoursLabel,
  getCourse,
  getCourses,
  getTrack,
  lessonHref,
} from "@/lib/content";

type CourseParams = { courseId: string };

export function generateStaticParams() {
  return getCourses().map((course) => ({ courseId: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CourseParams>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourse(courseId);
  return {
    title: course?.title ?? "Course",
    description: course?.subtitle ?? course?.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const types = countByType(course);
  const total = countLessons(course);
  const track = course.trackId ? getTrack(course.trackId) : undefined;

  return (
    <div className="paper-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10">
        <Link
          href={track ? `/track/${track.id}` : "/"}
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#82cdd6] hover:text-white"
        >
          ← {track ? track.title : "Library"}
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#82cdd6]">
              {track ? `${track.title} · ` : ""}
              {course.level ?? "Course"} · {courseHoursLabel(course)}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] text-white sm:text-6xl">
              {course.title}
            </h1>
            {course.subtitle ? (
              <p className="mt-5 text-xl leading-8 text-ink-soft">
                {course.subtitle}
              </p>
            ) : null}
            <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft">
              {course.description}
            </p>
            {course.outcomes && course.outcomes.length > 0 ? (
              <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((outcome, index) => (
                  <li
                    key={outcome}
                    className="rounded-2xl border border-[#f59e0b]/25 bg-[#f59e0b]/8 px-4 py-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#fbbf24]">
                      Outcome {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white">{outcome}</p>
                  </li>
                ))}
              </ol>
            ) : null}
            <div className="mt-8">
              <StartCourseLink course={course} />
            </div>
          </div>
          <aside className="h-fit rounded-[28px] border border-line bg-paper-2 p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-dust">
              In this course
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Lessons</dt>
                <dd className="font-display text-xl">{total}</dd>
              </div>
              <div className="flex justify-between">
                <dt>How-tos</dt>
                <dd>{types.video}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Readings</dt>
                <dd>{types.pdf}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Quizzes</dt>
                <dd>{types.quiz}</dd>
              </div>
              {types.assignment > 0 ? (
                <div className="flex justify-between">
                  <dt>Assignments</dt>
                  <dd>{types.assignment}</dd>
                </div>
              ) : null}
              {course.instructor ? (
                <div className="border-t border-line pt-4">
                  <dt className="text-dust">Faculty</dt>
                  <dd className="mt-1">
                    {course.instructor.name}
                    {course.instructor.title ? (
                      <span className="block text-dust">
                        {course.instructor.title}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl tracking-tight">Syllabus</h2>
          <div className="mt-6 space-y-8">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-display text-3xl text-[#22d3ee]">
                    {String(moduleIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium">{module.title}</h3>
                    {module.outcome ? (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#fbbf24]">
                        Outcome · {module.outcome}
                      </p>
                    ) : null}
                    {module.summary ? (
                      <p className="text-sm text-dust">{module.summary}</p>
                    ) : null}
                  </div>
                </div>
                <ol className="divide-y divide-[var(--line)] overflow-hidden rounded-[24px] border border-line bg-paper-2">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const Icon = lessonGlyph(lesson.type);
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={lessonHref(course.id, lesson.id)}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-white/5"
                        >
                          <span className="w-8 font-display text-xl text-dust">
                            {String(lessonIndex + 1).padStart(2, "0")}
                          </span>
                          <Icon className="h-4 w-4 text-[#00f0ff]" />
                          <span className="flex-1">
                            <span className="block font-medium">{lesson.title}</span>
                            <span className="text-xs uppercase tracking-[0.16em] text-dust">
                              {lessonLabels[lesson.type]}
                              {lesson.duration ? ` · ${lesson.duration}` : ""}
                            </span>
                          </span>
                          <span className="text-sm text-[#22d3ee]">Open</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
