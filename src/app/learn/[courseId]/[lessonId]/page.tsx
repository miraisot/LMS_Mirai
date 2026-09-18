import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnStudio } from "@/components/LearnStudio";
import {
  flattenLessons,
  getCourse,
  getCourses,
  getLessonContext,
} from "@/lib/content";

type LearnParams = { courseId: string; lessonId: string };

export function generateStaticParams() {
  return getCourses().flatMap((course) =>
    flattenLessons(course).map(({ lesson }) => ({
      courseId: course.id,
      lessonId: lesson.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LearnParams>;
}): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const context = course ? getLessonContext(course, lessonId) : null;
  return {
    title: context ? `${context.lesson.title} · ${course?.title}` : "Lesson",
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<LearnParams>;
}) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();
  const context = getLessonContext(course, lessonId);
  if (!context) notFound();

  return <LearnStudio course={course} lesson={context.lesson} />;
}
