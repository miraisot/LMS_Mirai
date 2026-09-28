"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/app/actions/auth";

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-white/60 transition hover:text-white disabled:opacity-60"
    >
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button />
    </form>
  );
}
