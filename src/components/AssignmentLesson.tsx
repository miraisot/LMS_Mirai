"use client";

import { useMemo, useState } from "react";
import type { AssignmentAttempt, AssignmentField, Lesson } from "@/lib/types";

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function fieldReady(field: AssignmentField, value: string) {
  const words = wordCount(value);
  if (words === 0) return false;
  return field.minWords ? words >= field.minWords : true;
}

export function AssignmentLesson({
  lesson,
  existing,
  onSubmit,
}: {
  lesson: Lesson;
  existing?: AssignmentAttempt;
  onSubmit: (attempt: AssignmentAttempt) => void;
}) {
  const assignment = lesson.assignment;
  const fields = assignment?.fields ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {},
  );
  const [done, setDone] = useState(Boolean(existing));

  const complete = useMemo(
    () => fields.every((field) => fieldReady(field, answers[field.id] ?? "")),
    [answers, fields],
  );

  if (!assignment || fields.length === 0) {
    return (
      <div className="rounded-3xl border border-line bg-paper-2 p-8">
        <p className="font-display text-2xl">This assignment has no brief yet.</p>
      </div>
    );
  }

  function submit() {
    const attempt: AssignmentAttempt = {
      answers,
      submittedAt: new Date().toISOString(),
    };
    setDone(true);
    onSubmit(attempt);
  }

  if (done) {
    return (
      <div className="rounded-[28px] border border-line bg-paper-2 p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-dust">
          Submitted
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">On the desk.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">
          Your brief is saved on this device. Come back and tighten it after the
          next how-to — the useful versions get rewritten.
        </p>
        <div className="mt-8 space-y-4">
          {fields.map((field, index) => {
            const value = answers[field.id] ?? "";
            return (
              <article
                key={field.id}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-dust">
                  {String(index + 1).padStart(2, "0")} · {wordCount(value)} words
                </p>
                <p className="mt-2 font-medium leading-6">{field.label}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                  {value || "—"}
                </p>
              </article>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-8 rounded-[10px] border border-line px-5 py-2 text-sm"
        >
          Edit submission
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-line bg-paper-2 p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-dust">
        Studio brief
      </p>
      <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight">
        {assignment.deliverable ?? "Write it like you will ship it."}
      </h2>
      {assignment.brief ? (
        <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-soft">
          {assignment.brief}
        </p>
      ) : null}

      {assignment.checklist && assignment.checklist.length > 0 ? (
        <ul className="mt-6 space-y-2 rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 p-5 text-sm leading-6 text-ink-soft">
          {assignment.checklist.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f0ff]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 space-y-5">
        {fields.map((field, index) => {
          const value = answers[field.id] ?? "";
          const words = wordCount(value);
          const ready = fieldReady(field, value);
          return (
            <label key={field.id} className="block">
              <div className="flex items-end justify-between gap-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-dust">
                  {String(index + 1).padStart(2, "0")} · {field.label}
                </p>
                <p
                  className={`text-[11px] uppercase tracking-[0.16em] ${
                    ready ? "text-[#82cdd6]" : "text-dust"
                  }`}
                >
                  {words}
                  {field.minWords ? ` / ${field.minWords}` : ""} words
                </p>
              </div>
              {field.hint ? (
                <p className="mt-2 text-sm leading-6 text-ink-soft">{field.hint}</p>
              ) : null}
              <textarea
                value={value}
                rows={field.rows ?? 5}
                placeholder={field.placeholder}
                onChange={(event) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [field.id]: event.target.value,
                  }))
                }
                className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-[#05070a] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-[#00f0ff]/70 focus:shadow-[0_0_24px_#00b4c81f]"
              />
            </label>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-dust">
          {complete
            ? "Ready to hand in."
            : "Fill every prompt before you submit."}
        </p>
        <button
          type="button"
          disabled={!complete}
          onClick={submit}
          className="ember-btn h-11 px-6 text-sm disabled:opacity-40"
        >
          Submit assignment
        </button>
      </div>
    </div>
  );
}
