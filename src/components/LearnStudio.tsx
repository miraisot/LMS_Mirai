"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { AssignmentLesson } from "@/components/AssignmentLesson";
import { PdfLesson } from "@/components/PdfLesson";
import { QuizLesson } from "@/components/QuizLesson";
import { VideoLesson } from "@/components/VideoLesson";
import { lessonGlyph, lessonLabels } from "@/components/glyphs";
import { persistVisit, useProgress } from "@/hooks/useProgress";
import { flattenLessons, getLessonContext, lessonHref } from "@/lib/content";
import { getCourseProgress, progressPercent } from "@/lib/progress";
import type { Course, Lesson } from "@/lib/types";

export function LearnStudio({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const { map, completeLesson, recordQuiz, recordAssignment } = useProgress();
  const [openNav, setOpenNav] = useState(false);
  const context = getLessonContext(course, lesson.id);
  const progress = getCourseProgress(map, course.id);
  const total = flattenLessons(course).length;
  const percent = progressPercent(progress.completedLessonIds.length, total);
  const complete = progress.completedLessonIds.includes(lesson.id);

  useEffect(() => {
    persistVisit(course.id, lesson.id);
  }, [course.id, lesson.id]);

  if (!context) return null;

  function goComplete() {
    completeLesson(course.id, lesson.id);
  }

  return (
    <div className="min-h-screen bg-night text-cream lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside
        className={`night-scroll fixed inset-y-0 left-0 z-30 w-[min(100%,320px)] overflow-y-auto border-r border-white/5 bg-night p-5 transition lg:static ${
          openNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <BrandMark />
          <button
            type="button"
            className="text-cream/60 lg:hidden"
            onClick={() => setOpenNav(false)}
          >
            Close
          </button>
        </div>
        <Link
          href={`/course/${course.id}`}
          className="mt-8 block text-[11px] uppercase tracking-[0.22em] text-cream/40 hover:text-cream"
        >
          ← {course.title}
        </Link>
        <div className="mt-6">
          <div className="flex items-end justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cream/40">
              Progress
            </p>
            <p className="font-display text-2xl">{percent}%</p>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#194cd1] to-[#00f0ff]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <nav className="mt-8 space-y-7">
          {course.modules.map((module, moduleIndex) => (
            <div key={module.id}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#82cdd6]">
                {String(moduleIndex + 1).padStart(2, "0")} ·{" "}
                {module.outcome ?? module.title}
              </p>
              <ul className="mt-3 space-y-1">
                {module.lessons.map((item) => {
                  const Icon = lessonGlyph(item.type);
                  const active = item.id === lesson.id;
                  const done = progress.completedLessonIds.includes(item.id);
                  return (
                    <li key={item.id}>
                      <Link
                        href={lessonHref(course.id, item.id)}
                        onClick={() => setOpenNav(false)}
                        className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm leading-5 ${
                          active
                            ? "bg-white/10 text-cream"
                            : "text-cream/60 hover:bg-white/5 hover:text-cream"
                        }`}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                        {done ? (
                          <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {openNav ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-label="Close syllabus"
          onClick={() => setOpenNav(false)}
        />
      ) : null}

      <main className="min-h-screen bg-paper text-ink">
        <div className="border-b border-line px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="text-sm text-dust lg:hidden"
              onClick={() => setOpenNav(true)}
            >
              Syllabus
            </button>
            <p className="text-[11px] uppercase tracking-[0.2em] text-dust">
              {context.module.outcome
                ? `Outcome · ${context.module.outcome}`
                : context.module.title}{" "}
              · {lessonLabels[lesson.type]} · {context.number}/{context.total}
            </p>
            <p className="hidden text-sm text-dust sm:block">
              {lesson.duration ?? "Self-paced"}
            </p>
          </div>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          {lesson.description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
              {lesson.description}
            </p>
          ) : null}
        </div>

        <div className="px-5 py-6 pb-28 sm:px-8">
          {lesson.type === "video" ? <VideoLesson lesson={lesson} /> : null}
          {lesson.type === "pdf" ? <PdfLesson lesson={lesson} /> : null}
          {lesson.type === "quiz" ? (
            <QuizLesson
              key={lesson.id}
              lesson={lesson}
              existing={progress.quizResults[lesson.id]}
              onSubmit={(attempt) => recordQuiz(course.id, lesson.id, attempt)}
            />
          ) : null}
          {lesson.type === "assignment" ? (
            <AssignmentLesson
              key={lesson.id}
              lesson={lesson}
              existing={progress.assignmentResults[lesson.id]}
              onSubmit={(attempt) =>
                recordAssignment(course.id, lesson.id, attempt)
              }
            />
          ) : null}
        </div>

        <div className="sticky bottom-0 border-t border-line bg-paper/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {context.prev ? (
              <Link
                href={lessonHref(course.id, context.prev.lesson.id)}
                className="text-sm text-dust hover:text-ink"
              >
                ← {context.prev.lesson.title}
              </Link>
            ) : (
              <Link href={`/course/${course.id}`} className="text-sm text-dust">
                ← Course overview
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {lesson.type !== "quiz" && lesson.type !== "assignment" ? (
                <button
                  type="button"
                  onClick={goComplete}
                  className={`h-11 rounded-[10px] px-5 text-sm ${
                    complete
                      ? "border border-[#069bad]/50 text-[#82cdd6]"
                      : "border border-white/15 text-white"
                  }`}
                >
                  {complete ? "Marked done" : "Mark as done"}
                </button>
              ) : null}
              {context.next ? (
                <Link
                  href={lessonHref(course.id, context.next.lesson.id)}
                  onClick={() => {
                    if (lesson.type !== "quiz" && lesson.type !== "assignment") {
                      goComplete();
                    }
                  }}
                  className="ember-btn inline-flex h-11 items-center px-6 text-sm"
                >
                  Next lesson
                </Link>
              ) : (
                <Link
                  href={`/course/${course.id}`}
                  onClick={() => {
                    if (lesson.type !== "quiz" && lesson.type !== "assignment") {
                      goComplete();
                    }
                  }}
                  className="inline-flex h-11 items-center rounded-[10px] bg-[#069bad] px-6 text-sm text-white"
                >
                  Finish course
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
