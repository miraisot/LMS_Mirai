import type { CourseProgress, ProgressMap, QuizAttempt } from "./types";

export const PROGRESS_KEY = "studio-hall-progress-v1";

const emptyCourse = (): CourseProgress => ({
  completedLessonIds: [],
  quizResults: {},
});

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

export function getCourseProgress(
  map: ProgressMap,
  courseId: string,
): CourseProgress {
  return map[courseId] ?? emptyCourse();
}

export function withCourse(
  map: ProgressMap,
  courseId: string,
  updater: (current: CourseProgress) => CourseProgress,
): ProgressMap {
  const next = updater(getCourseProgress(map, courseId));
  return { ...map, [courseId]: next };
}

export function markLessonComplete(
  map: ProgressMap,
  courseId: string,
  lessonId: string,
): ProgressMap {
  return withCourse(map, courseId, (current) => ({
    ...current,
    lastLessonId: lessonId,
    completedLessonIds: current.completedLessonIds.includes(lessonId)
      ? current.completedLessonIds
      : [...current.completedLessonIds, lessonId],
  }));
}

export function touchLesson(
  map: ProgressMap,
  courseId: string,
  lessonId: string,
): ProgressMap {
  return withCourse(map, courseId, (current) => ({
    ...current,
    lastLessonId: lessonId,
  }));
}

export function saveQuizAttempt(
  map: ProgressMap,
  courseId: string,
  lessonId: string,
  attempt: QuizAttempt,
): ProgressMap {
  return withCourse(map, courseId, (current) => ({
    ...current,
    lastLessonId: lessonId,
    completedLessonIds: current.completedLessonIds.includes(lessonId)
      ? current.completedLessonIds
      : [...current.completedLessonIds, lessonId],
    quizResults: {
      ...current.quizResults,
      [lessonId]: attempt,
    },
  }));
}

export function progressPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}
