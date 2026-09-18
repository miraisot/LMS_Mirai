"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  PROGRESS_KEY,
  loadProgress,
  markLessonComplete,
  saveProgress,
  saveQuizAttempt,
  touchLesson,
} from "@/lib/progress";
import type { ProgressMap, QuizAttempt } from "@/lib/types";

const EVENT = "lms-progress";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(PROGRESS_KEY) ?? "{}";
}

function getServerSnapshot() {
  return "{}";
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

export function useProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const map = useMemo(() => {
    try {
      const parsed = JSON.parse(raw) as ProgressMap;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }, [raw]);

  const persist = useCallback((next: ProgressMap) => {
    saveProgress(next);
    emit();
  }, []);

  const completeLesson = useCallback(
    (courseId: string, lessonId: string) => {
      persist(markLessonComplete(map, courseId, lessonId));
    },
    [map, persist],
  );

  const openLesson = useCallback(
    (courseId: string, lessonId: string) => {
      persist(touchLesson(map, courseId, lessonId));
    },
    [map, persist],
  );

  const recordQuiz = useCallback(
    (courseId: string, lessonId: string, attempt: QuizAttempt) => {
      persist(saveQuizAttempt(map, courseId, lessonId, attempt));
    },
    [map, persist],
  );

  return { map, ready: true, completeLesson, openLesson, recordQuiz };
}

export function persistVisit(courseId: string, lessonId: string) {
  const next = touchLesson(loadProgress(), courseId, lessonId);
  saveProgress(next);
  emit();
}
