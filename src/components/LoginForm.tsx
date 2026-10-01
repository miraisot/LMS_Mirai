"use client";

import { useActionState } from "react";
import { login, loginWithGoogle } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <>
      <form action={loginWithGoogle} className="mt-8">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-white/15 bg-white px-3 py-2.5 text-sm font-semibold text-[#0b0d1a] transition hover:bg-white/90"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-dust">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form action={action} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-dust"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            className="mt-2 w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-[#069bad]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-dust"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-[10px] border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-[#069bad]"
          />
        </div>
        {state?.error ? (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="ember-btn w-full py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.4 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.4 0-9.9-3.1-11.3-7.5l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.6 4.9l6 5.1c-.4.4 6.3-4.6 6.3-14 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
