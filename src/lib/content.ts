import type {
  Catalog,
  Course,
  Lesson,
  Module,
} from "./types";
import raw from "../../data/courses.json";

function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== "object") return false;
  const course = value as Course;
  return typeof course.id === "string" && Array.isArray(course.modules);
}

function normalize(input: unknown): Catalog {
  if (Array.isArray(input)) {
    return { courses: input.filter(isCourse) };
  }

  if (input && typeof input === "object") {
    const maybeCatalog = input as { courses?: unknown };
    if (Array.isArray(maybeCatalog.courses)) {
      return { courses: maybeCatalog.courses.filter(isCourse) };
    }
    if (isCourse(input)) {
      return { courses: [input] };
    }
  }

  return { courses: [] };
}

export const catalog = normalize(raw);

export function getCourses(): Course[] {
  return catalog.courses;
}

export function getCourse(courseId: string): Course | undefined {
  return catalog.courses.find((course) => course.id === courseId);
}

export function flattenLessons(course: Course): Array<{
  module: Module;
  lesson: Lesson;
  index: number;
}> {
  const items: Array<{ module: Module; lesson: Lesson; index: number }> = [];
  let index = 0;
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      items.push({ module: courseModule, lesson, index });
      index += 1;
    }
  }
  return items;
}

export function getLessonContext(course: Course, lessonId: string) {
  const items = flattenLessons(course);
  const current = items.find((item) => item.lesson.id === lessonId);
  if (!current) return null;

  const prev = items[current.index - 1] ?? null;
  const next = items[current.index + 1] ?? null;

  return {
    ...current,
    total: items.length,
    number: current.index + 1,
    prev,
    next,
  };
}

export function countLessons(course: Course) {
  return flattenLessons(course).length;
}

export function countByType(course: Course) {
  return flattenLessons(course).reduce(
    (acc, item) => {
      acc[item.lesson.type] += 1;
      return acc;
    },
    { video: 0, pdf: 0, quiz: 0 },
  );
}

export function firstLesson(course: Course): Lesson | undefined {
  return flattenLessons(course)[0]?.lesson;
}

export function courseHoursLabel(course: Course) {
  return course.hours ?? "Self-paced";
}

export function lessonHref(courseId: string, lessonId: string) {
  return `/learn/${courseId}/${lessonId}`;
}
