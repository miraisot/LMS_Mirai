# Student LMS

A student portal for [Mirai School of Technology](https://miraisot.com/). Courses come from a JSON file. Lectures become YouTube embeds, readings open as PDFs, and quizzes run in the browser. Branding comes from `.env`. Progress is stored in `localStorage` so this can grow into a backend later.

The visual system matches miraisot.com: Outfit type, dark navy surfaces, cyan-to-blue heading gradients, and teal CTA buttons.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Branding (`.env.local`)

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_LMS_NAME` | Portal name in the header and tab |
| `NEXT_PUBLIC_LMS_TAGLINE` | Short line on the library page |
| `NEXT_PUBLIC_INSTITUTION` | Campus / org line under the name |
| `NEXT_PUBLIC_STUDENT_NAME` | Greeting chip |
| `NEXT_PUBLIC_LMS_LOGO` | Optional logo URL |

## Content (`data/courses.json`)

Replace the sample file with yours. The loader also accepts a single course object, `type: "youtube"` as video, quiz `question` / string `options` / numeric `correctAnswer`, and HTML entities like `&amp;`.

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
