import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, localizeHref } from "@/i18n/config";

/**
 * - /ko/... and /zh/...  → served as-is
 * - /en/...              → 308 to the clean English URL (no duplicate content)
 * - everything else      → rewritten internally to /en/...
 * - a visitor who previously chose Korean/Chinese (cookie) and lands on an English URL
 *   is sent to the same page in their language.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (first === "ko" || first === "zh") return NextResponse.next();

  if (first === "en") {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const preferred = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(preferred) && preferred !== defaultLocale) {
    const url = req.nextUrl.clone();
    url.pathname = localizeHref(pathname, preferred);
    return NextResponse.redirect(url, 307);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // skip API, Next internals, metadata routes and any file with an extension
  matcher: ["/((?!api|_next|studio|sitemap.xml|robots.txt|opengraph-image|favicon.ico|.*\\..*).*)"],
};
