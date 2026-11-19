import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target → instant publishing.
 * In sanity.io/manage → API → Webhooks, POST to
 *   https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * on create/update/delete of any document.
 */
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout"); // content is shared across pages (nav, footer, prices) – refresh everything
  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() });
}
