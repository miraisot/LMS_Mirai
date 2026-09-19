import { CourseGrid, ResumeLearning } from "@/components/ResumeLearning";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { countLessons, getCourses } from "@/lib/content";
import { site } from "@/lib/config";

export default function HomePage() {
  const courses = getCourses();
  const lessonCount = courses.reduce((sum, course) => sum + countLessons(course), 0);

  return (
    <div className="paper-grid min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-14 lg:px-8">
        <section className="max-w-3xl">
          <p className="rise inline-flex items-center rounded-full border border-[#069bad]/40 bg-[#069bad]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#82cdd6]">
            {site.institution} · Day 1
          </p>
          <h1 className="rise rise-delay-1 mt-6 font-display text-[clamp(2.1rem,6vw,4.4rem)] leading-[1.05]">
            <span className="heading-gradient">Engineer your future</span>
            <span className="mt-1 block text-white">
              with <span className="heading-accent">AI</span>
            </span>
          </h1>
          <p className="rise rise-delay-2 mt-6 max-w-xl text-base leading-7 text-ink-soft md:text-lg md:leading-8">
            {site.tagline} Watch a short how-to, do the lab, then ship the
            assignment — the same stack students use from week one.
          </p>
          <dl className="rise rise-delay-3 mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
            <div>
              <dt className="text-dust">Courses</dt>
              <dd className="mt-1 font-display text-3xl text-white">{courses.length}</dd>
            </div>
            <div>
              <dt className="text-dust">Lessons</dt>
              <dd className="mt-1 font-display text-3xl text-white">{lessonCount}</dd>
            </div>
            <div>
              <dt className="text-dust">Hello</dt>
              <dd className="mt-1 font-display text-3xl text-white">{site.studentName}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-14">
          <ResumeLearning courses={courses} />
        </div>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-white">Your library</h2>
            <p className="text-sm text-dust">Replace data/courses.json anytime</p>
          </div>
          <CourseGrid courses={courses} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
