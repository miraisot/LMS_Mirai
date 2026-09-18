const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (ID_PATTERN.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && ID_PATTERN.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && ID_PATTERN.test(fromQuery)) return fromQuery;

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) =>
        ["embed", "shorts", "live", "v"].includes(part),
      );
      if (marker >= 0 && parts[marker + 1] && ID_PATTERN.test(parts[marker + 1])) {
        return parts[marker + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function toYouTubeEmbed(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
