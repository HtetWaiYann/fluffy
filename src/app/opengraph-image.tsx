import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_COLOR_BG, SITE_COLOR_INK, SITE_NAME } from "@/data/site";

// the preview card shown when the link is shared (linkedin, slack, x...).
// next/og ships with next, and with no request data this renders once at build time.

export const alt = `${SITE_NAME}: an animated landing page`;
// 1200×630: the size open graph and x recommend for large preview cards.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// big enough to read on a small chat preview thumbnail.
const TITLE_FONT_SIZE = 128;
const SUBTITLE_FONT_SIZE = 40;

// same face and weight as the page title. a static .ttf, because next/og can't read
// the woff2 files next/font downloads, or variable fonts. read once, not per render.
// See https://nextjs.org/docs/app/api-reference/functions/image-response#custom-fonts
const FREDOKA_WEIGHT = 600;
const fredoka = await readFile(
  join(process.cwd(), "assets/fonts/Fredoka-SemiBold.ttf"),
);

/**
 * Builds the share image: the wordmark on the page's own colours.
 * @returns the png response
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: SITE_COLOR_BG,
        color: SITE_COLOR_INK,
        fontFamily: "Fredoka",
      }}
    >
      <div style={{ fontSize: TITLE_FONT_SIZE }}>{SITE_NAME}</div>
      <div style={{ fontSize: SUBTITLE_FONT_SIZE }}>
        A hopping crowd, one scroll, one big scene change.
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Fredoka", data: fredoka, weight: FREDOKA_WEIGHT }],
    },
  );
}
