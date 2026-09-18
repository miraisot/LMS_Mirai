"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
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
  );
}
