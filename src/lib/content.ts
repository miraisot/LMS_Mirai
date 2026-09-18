import type {
  Catalog,
  Course,
  Lesson,
  LessonType,
  Module,
  Quiz,
  QuizOption,
  QuizQuestion,
} from "./types";
import raw from "../../data/courses.json";

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? decodeEntities(value.trim()) : "";
}

function slug(value: string) {
  const slugified = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slugified.slice(0, 72) || "course";
}

function optionId(index: number) {
  return String.fromCharCode(97 + (index % 26));
}

function normalizeOptions(value: unknown): QuizOption[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: optionId(index), text: decodeEntities(item) };
      }
      const record = asRecord(item);
      if (!record) return null;
      const text = asString(record.text);
      if (!text) return null;
      return { id: asString(record.id) || optionId(index), text };
    })
    .filter((item): item is QuizOption => item !== null);
}

function normalizeQuestion(value: unknown, index: number): QuizQuestion | null {
  const record = asRecord(value);
  if (!record) return null;
  const prompt = asString(record.prompt) || asString(record.question);
  const options = normalizeOptions(record.options);
  if (!prompt || options.length === 0) return null;

  let correctOptionIds: string[] | undefined;
  if (Array.isArray(record.correctOptionIds)) {
    correctOptionIds = record.correctOptionIds.map((id) => String(id));
  } else if (typeof record.correctAnswer === "number" && options[record.correctAnswer]) {
    correctOptionIds = [options[record.correctAnswer].id];
  } else if (typeof record.correctAnswer === "string") {
    const match = options.find(
      (option) => option.id === record.correctAnswer || option.text === record.correctAnswer,
    );
    if (match) correctOptionIds = [match.id];
  }

  return {
    id: asString(record.id) || `q${index + 1}`,
    prompt,
    type: record.type === "multiple" ? "multiple" : "single",
    options,
    correctOptionIds,
    explanation: asString(record.explanation) || undefined,
  };
}

function normalizeQuiz(record: Record<string, unknown>): Quiz | undefined {
  const source = Array.isArray(record.questions)
    ? record.questions
    : Array.isArray(asRecord(record.quiz)?.questions)
      ? (asRecord(record.quiz)?.questions as unknown[])
      : null;
  if (!source) return undefined;
  const questions = source
    .map((item, index) => normalizeQuestion(item, index))
    .filter((item): item is QuizQuestion => item !== null);
  if (questions.length === 0) return undefined;
  const passing = asRecord(record.quiz)?.passingScore ?? record.passingScore;
  return {
    passingScore: typeof passing === "number" ? passing : 70,
    questions,
  };
}

function normalizeLessonType(value: unknown): LessonType | null {
  if (value === "youtube" || value === "video") return "video";
  if (value === "pdf" || value === "quiz") return value;
  return null;
}

function normalizeLesson(value: unknown, index: number): Lesson | null {
  const record = asRecord(value);
  if (!record) return null;
  const type = normalizeLessonType(record.type);
  if (!type) return null;
  const title = asString(record.title);
  if (!title) return null;
  const quiz = type === "quiz" ? normalizeQuiz(record) : undefined;
  return {
    id: asString(record.id) || `lesson-${index + 1}`,
    title,
    type,
    duration: asString(record.duration) || undefined,
    description: asString(record.description) || undefined,
    url: asString(record.url) || undefined,
    quiz,
  };
}

function normalizeModule(value: unknown, index: number): Module | null {
  const record = asRecord(value);
  if (!record || !Array.isArray(record.lessons)) return null;
  const title = asString(record.title);
  if (!title) return null;
  const lessons = record.lessons
    .map((item, lessonIndex) => normalizeLesson(item, lessonIndex))
    .filter((item): item is Lesson => item !== null);
  if (lessons.length === 0) return null;
  return {
    id: asString(record.id) || `module-${index + 1}`,
    title,
    summary: asString(record.summary) || undefined,
    lessons,
  };
}

function normalizeCourse(value: unknown, index: number): Course | null {
  const record = asRecord(value);
  if (!record || !Array.isArray(record.modules)) return null;
  const title = asString(record.title) || asString(record.courseTitle);
  if (!title) return null;
  const modules = record.modules
    .map((item, moduleIndex) => normalizeModule(item, moduleIndex))
    .filter((item): item is Module => item !== null);
  if (modules.length === 0) return null;
  const instructor = asRecord(record.instructor);
  return {
    id: asString(record.id) || slug(title) || `course-${index + 1}`,
    title,
    subtitle: asString(record.subtitle) || undefined,
    description: asString(record.description),
    level: asString(record.level) || undefined,
    hours: asString(record.hours) || undefined,
    tags: Array.isArray(record.tags)
      ? record.tags.filter((tag): tag is string => typeof tag === "string")
      : undefined,
    accent: asString(record.accent) || undefined,
    instructor: instructor
      ? {
          name: asString(instructor.name),
          title: asString(instructor.title) || undefined,
        }
      : undefined,
    modules,
  };
}

function normalize(input: unknown): Catalog {
  if (Array.isArray(input)) {
    return {
      courses: input
        .map((item, index) => normalizeCourse(item, index))
        .filter((item): item is Course => item !== null),
    };
  }

  const record = asRecord(input);
  if (!record) return { courses: [] };

  if (Array.isArray(record.courses)) {
    return {
      courses: record.courses
        .map((item, index) => normalizeCourse(item, index))
        .filter((item): item is Course => item !== null),
    };
  }

  const single = normalizeCourse(record, 0);
  return { courses: single ? [single] : [] };
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
