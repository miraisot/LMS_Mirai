import { logout } from "@/app/actions/auth";
import { BrandMark } from "@/components/BrandMark";
import { site } from "@/lib/config";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40">
      <div className="ticker flex items-center justify-center gap-3 px-4 py-2 text-center text-[12px] font-medium text-white">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          LIVE
        </span>
        <span className="hidden sm:inline">
          Student library · how-tos · labs · assignments
        </span>
      </div>
      <header className="border-b border-white/10 bg-[#05070a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
          <BrandMark />
          <div className="flex items-center gap-5 text-[15px] text-white/80">
            <span className="hidden sm:inline">Library</span>
            <span className="rounded-[10px] border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white">
              {site.studentName}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-white/60 transition hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050a14]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 {site.name}. All rights reserved.</p>
        <p>Content from JSON · Progress stays on this device</p>
      </div>
    </footer>
  );
}
