# Student LMS

A student portal for [Mirai School of Technology](https://miraisot.com/). Courses come from a JSON file. Lectures become YouTube embeds, readings open as PDFs, and quizzes run in the browser. Branding comes from `.env`. Sign-in is backed by Supabase Auth; lesson/quiz progress is stored in `localStorage`.

The visual system matches miraisot.com: Outfit type, dark navy surfaces, cyan-to-blue heading gradients, and teal CTA buttons.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, `proxy.ts` for route gating — renamed from Middleware in v16) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| Language | TypeScript |
| Auth | [Supabase Auth](https://supabase.com/auth) via `@supabase/supabase-js` and `@supabase/ssr` (email + password, cookie-based sessions) |
| Content | Static JSON (`data/courses/`) — no database/CMS for course content |
| Lint | ESLint (`eslint-config-next`) |

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` (from your Supabase project's **Project Settings → API**), and create at least one user under **Authentication → Users** in the Supabase dashboard to sign in with.

Open [http://localhost:3000](http://localhost:3000).

## Branding (`.env`)

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_LMS_NAME` | Portal name in the header and tab |
| `NEXT_PUBLIC_LMS_TAGLINE` | Short line on the library page |
| `NEXT_PUBLIC_INSTITUTION` | Campus / org line under the name |
| `NEXT_PUBLIC_STUDENT_NAME` | Greeting chip |
| `NEXT_PUBLIC_LMS_LOGO` | Optional logo URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, used for auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key, used for auth |

## Content (`data/courses/`)

Each course is one JSON file. `index.json` lists tracks and the load order of course ids:

```
data/courses/index.json
data/courses/open-source.json
data/courses/gsoc.json
data/courses/product-development.json
data/courses/entrepreneurship.json
data/courses/interview-startups.json
```

Replace a course file (or add a new one and register it in `index.json` plus `src/lib/content.ts`). The loader also accepts a single course object, `type: "youtube"` as video, quiz `question` / string `options` / numeric `correctAnswer`, and HTML entities like `&amp;`.

Each lesson is one of:

```json
{ "id": "l1", "title": "Lecture", "type": "video", "url": "https://www.youtube.com/watch?v=..." }
{ "id": "l2", "title": "Notes", "type": "pdf", "url": "https://example.com/notes.pdf" }
{
  "id": "l3",
  "title": "Check",
  "type": "quiz",
  "quiz": {
    "passingScore": 70,
    "questions": [
      {
        "id": "q1",
        "prompt": "…",
        "type": "single",
        "options": [
          { "id": "a", "text": "…" },
          { "id": "b", "text": "…" }
        ],
        "correctOptionIds": ["b"],
        "explanation": "Optional."
      }
    ]
  }
}
```

Leave `correctOptionIds` off until you have results. Students can still submit; the quiz is saved as practice instead of being auto-graded.

YouTube watch, short, embed, and `youtu.be` links all convert to an iframe. PDFs that block embedding can be opened in a new tab or through the built-in Google viewer toggle.
