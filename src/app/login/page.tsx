import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/LoginForm";
import { site } from "@/lib/config";

export const metadata = {
  title: "Sign in",
};

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const oauthError =
    error === "google"
      ? "Could not start Google sign-in. Try again."
      : error === "oauth"
        ? "Google sign-in did not complete. Try again."
        : null;

  return (
    <div className="paper-grid flex min-h-screen items-center justify-center px-5">
      <div className="rise w-full max-w-sm rounded-2xl border border-white/10 bg-[#080a18]/80 p-8 shadow-[var(--shadow)] backdrop-blur">
        <div className="flex justify-center">
          <BrandMark />
        </div>
        <h1 className="mt-8 text-center font-display text-2xl text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Sign in to continue to {site.name}.
        </p>
        {oauthError ? (
          <p
            role="alert"
            className="mt-4 rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {oauthError}
          </p>
        ) : null}
        <LoginForm />
      </div>
    </div>
  );
}
