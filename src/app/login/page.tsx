import { redirect } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "@/components/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/config";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

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
        <LoginForm />
      </div>
    </div>
  );
}
