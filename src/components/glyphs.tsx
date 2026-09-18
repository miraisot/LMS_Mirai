export function VideoGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h7A1.5 1.5 0 0 1 13 3.5v9A1.5 1.5 0 0 1 11.5 14h-7A1.5 1.5 0 0 1 3 12.5v-9zM6.75 5.4v5.2L11 8 6.75 5.4z" />
    </svg>
  );
}

export function PdfGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4 1.5A1.5 1.5 0 0 1 5.5 0H9l4 4v10.5A1.5 1.5 0 0 1 11.5 16h-6A1.5 1.5 0 0 1 4 14.5v-13zM9 1.5V5h3.5L9 1.5zM6 8h4v1H6V8zm0 2.5h4v1H6v-1zM6 13h2.5v1H6v-1z" />
    </svg>
  );
}

export function QuizGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 1.2 14.8 8 8 14.8 1.2 8 8 1.2zM8 4.4c-1.2 0-2 .7-2 1.8h1.3c0-.5.3-.7.7-.7s.7.2.7.6c0 .5-.4.7-.9 1.1-.6.4-.9.9-.9 1.6v.3h1.3v-.2c0-.4.2-.7.8-1.1.8-.5 1.4-1 1.4-1.9 0-1.2-.9-1.5-2.4-1.5zM8 11.4a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6z" />
    </svg>
  );
}

export function lessonGlyph(type: "video" | "pdf" | "quiz") {
  if (type === "video") return VideoGlyph;
  if (type === "pdf") return PdfGlyph;
  return QuizGlyph;
}

export const lessonLabels: Record<"video" | "pdf" | "quiz", string> = {
  video: "Lecture",
  pdf: "Reading",
  quiz: "Quiz",
};
