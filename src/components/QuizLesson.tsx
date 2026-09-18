"use client";

import { useMemo, useState } from "react";
import type { Lesson, QuizAttempt, QuizQuestion } from "@/lib/types";

function arraysEqual(a: string[], b: string[]) {
  const left = [...a].sort();
  const right = [...b].sort();
  return left.length === right.length && left.every((item, i) => item === right[i]);
}

function gradeQuestion(question: QuizQuestion, selected: string[]) {
  if (!question.correctOptionIds || question.correctOptionIds.length === 0) {
    return null;
  }
  return arraysEqual(selected, question.correctOptionIds);
}

function scoreAttempt(questions: QuizQuestion[], answers: Record<string, string[]>) {
  const gradable = questions.filter(
    (question) => question.correctOptionIds && question.correctOptionIds.length > 0,
  );
  if (gradable.length === 0) return null;
  const correct = gradable.filter((question) =>
    gradeQuestion(question, answers[question.id] ?? []),
  ).length;
  return Math.round((correct / gradable.length) * 100);
}

export function QuizLesson({
  lesson,
  existing,
  onSubmit,
}: {
  lesson: Lesson;
  existing?: QuizAttempt;
  onSubmit: (attempt: QuizAttempt) => void;
}) {
  const quiz = lesson.quiz;
  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>(
    existing?.answers ?? {},
  );
  const [done, setDone] = useState(Boolean(existing));
  const current = questions[index];

  const result = useMemo(() => {
    if (!done) return null;
    const score = scoreAttempt(questions, answers);
    const passing = quiz?.passingScore ?? 70;
    return {
      score,
      passed: score === null ? null : score >= passing,
    };
  }, [answers, done, questions, quiz?.passingScore]);

  if (!quiz || questions.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-paper-2 p-8">
        <p className="font-display text-2xl">This quiz has no questions yet.</p>
      </div>
    );
  }

  function toggle(question: QuizQuestion, optionId: string) {
    setAnswers((prev) => {
      const currentAnswers = prev[question.id] ?? [];
      if (question.type === "multiple") {
        const next = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }

  function submit() {
    const score = scoreAttempt(questions, answers);
    const passing = quiz?.passingScore ?? 70;
    const attempt: QuizAttempt = {
      answers,
      score,
      passed: score === null ? null : score >= passing,
      submittedAt: new Date().toISOString(),
    };
    setDone(true);
    onSubmit(attempt);
  }

  if (done && result) {
    return (
      <div className="rounded-[28px] border border-line bg-paper-2 p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-dust">Results</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">
          {result.score === null
            ? "Saved."
            : result.passed
              ? "Clear."
              : "Not yet."}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
          {result.score === null
            ? "This quiz has no answer key in the JSON, so it is recorded as practice. Add correctOptionIds later to grade it."
            : `You scored ${result.score}%. Passing is ${quiz.passingScore ?? 70}%.`}
        </p>
        <div className="mt-8 space-y-4">
          {questions.map((question, questionIndex) => {
            const selected = answers[question.id] ?? [];
            const ok = gradeQuestion(question, selected);
            return (
              <article
                key={question.id}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-dust">
                  Q{questionIndex + 1}
                  {ok === null ? "" : ok ? " · correct" : " · review"}
                </p>
                <p className="mt-2 font-medium leading-6">{question.prompt}</p>
                <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                  {question.options.map((option) => {
                    const chosen = selected.includes(option.id);
                    const isKey = question.correctOptionIds?.includes(option.id);
                    return (
                      <li
                        key={option.id}
                        className={
                          isKey ? "text-pine" : chosen ? "text-ember" : undefined
                        }
                      >
                        {chosen ? "▸ " : "· "}
                        {option.text}
                      </li>
                    );
                  })}
                </ul>
                {question.explanation ? (
                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    {question.explanation}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setIndex(0);
          }}
          className="mt-8 rounded-[10px] border border-line px-5 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const selected = current ? (answers[current.id] ?? []) : [];
  const canAdvance = selected.length > 0;

  return (
    <div className="rounded-[28px] border border-line bg-paper-2 p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-dust">
            Question {index + 1} of {questions.length}
            {current?.type === "multiple" ? " · select all that apply" : ""}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight">
            {current.prompt}
          </h2>
        </div>
        <p className="hidden font-display text-5xl text-brass/70 sm:block">
          {String(index + 1).padStart(2, "0")}
        </p>
      </div>
      <div className="mt-8 space-y-3">
        {current.options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(current, option.id)}
                className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                on
                  ? "border-[#00f0ff]/70 bg-[#00f0ff]/10 shadow-[0_0_24px_#00b4c81f]"
                  : "border-white/10 bg-[#05070a] hover:border-white/25"
              }`}
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                  on ? "border-[#00f0ff] bg-[#00f0ff] text-[#05070a]" : "border-line text-dust"
                }`}
              >
                {option.id.toUpperCase()}
              </span>
              <span className="leading-6">{option.text}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          className="text-sm text-dust disabled:opacity-30"
        >
          Back
        </button>
        {index === questions.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={submit}
            className="ember-btn h-11 px-6 text-sm disabled:opacity-40"
          >
            Submit quiz
          </button>
        ) : (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setIndex((value) => value + 1)}
            className="h-11 rounded-[10px] bg-white/10 px-6 text-sm text-white disabled:opacity-40"
          >
            Next question
          </button>
        )}
      </div>
    </div>
  );
}
