import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSupabaseConfigured, updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user } = await updateSession(request);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
