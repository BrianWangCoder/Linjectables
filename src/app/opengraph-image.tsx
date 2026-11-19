import { ImageResponse } from "next/og";

export const alt = "LINJECTABLES – Aesthetic injectables, Auckland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image (pages can override via the CMS SEO image). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a0a0a", color: "#f4f4f2" }}>
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", opacity: 0.6 }}>Auckland, New Zealand</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: 26, fontWeight: 300 }}>LINJECTABLES</div>
          <div style={{ fontSize: 34, marginTop: 24, opacity: 0.75 }}>Natural results. Expert hands.</div>
        </div>
      </div>
    ),
    size,
  );
}
