import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import {
  SITE_COLOR_BG,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/data/site";
import { LoaderProvider } from "@/components/providers/LoaderProvider";
import "@/styles/globals.scss";

// Rounded, friendly faces to match the hand-drawn characters
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-body",
});

// seo: title + description for search results, open graph / twitter for link previews.
// metadataBase turns relative urls (canonical, share image) into full ones.
// the share image comes from opengraph-image.tsx, next adds its tags itself.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// next 16 wants themeColor here, not in metadata. colours the mobile browser bar to match the page.
export const viewport: Viewport = {
  themeColor: SITE_COLOR_BG,
};

/** Root HTML shell. Server component; only the providers run in the browser. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <LoaderProvider>
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}
