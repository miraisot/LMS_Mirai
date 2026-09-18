export type LessonType = "video" | "pdf" | "quiz";

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  type?: "single" | "multiple";
  options: QuizOption[];
  /** Omit these when you only want students to submit, not auto-grade. */
  correctOptionIds?: string[];
  explanation?: string;
};

export type Quiz = {
  passingScore?: number;
  questions: QuizQuestion[];
};

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration?: string;
  description?: string;
  url?: string;
  quiz?: Quiz;
};

export type Module = {
  id: string;
  title: string;
  summary?: string;
  lessons: Lesson[];
};

export type Instructor = {
  name: string;
  title?: string;
};

export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  level?: string;
  hours?: string;
  tags?: string[];
  accent?: string;
  instructor?: Instructor;
  modules: Module[];
};

export type Catalog = {
  courses: Course[];
};

export type QuizAttempt = {
  answers: Record<string, string[]>;
  score: number | null;
  passed: boolean | null;
  submittedAt: string;
};

export type CourseProgress = {
  completedLessonIds: string[];
  lastLessonId?: string;
  quizResults: Record<string, QuizAttempt>;
};

export type ProgressMap = Record<string, CourseProgress>;
