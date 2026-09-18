"use client";

import { useState } from "react";
import { googlePdfViewer } from "@/lib/pdf";
import type { Lesson } from "@/lib/types";

export function PdfLesson({ lesson }: { lesson: Lesson }) {
  const [mode, setMode] = useState<"direct" | "google">("direct");
  const url = lesson.url;

  if (!url) {
    return (
      <div className="rounded-3xl border border-line bg-paper-2 p-8">
        <p className="font-display text-2xl">No PDF linked yet.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Put a PDF URL on this lesson in the JSON file.
        </p>
      </div>
    );
  }

  const src = mode === "google" ? googlePdfViewer(url) : url;

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-paper-2 shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-dust">
          Reading desk
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`rounded-[8px] px-3 py-1 ${mode === "direct" ? "bg-white/10 text-white" : "text-ink-soft"}`}
          >
            Direct
          </button>
          <button
            type="button"
            onClick={() => setMode("google")}
            className={`rounded-[8px] px-3 py-1 ${mode === "google" ? "bg-white/10 text-white" : "text-ink-soft"}`}
          >
            Viewer
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-[8px] border border-line px-3 py-1 text-ink-soft hover:text-white"
          >
            Open tab
          </a>
        </div>
      </div>
      <iframe
        src={src}
        title={lesson.title}
        className="h-[min(72vh,820px)] w-full bg-white"
      />
    </div>
  );
}
