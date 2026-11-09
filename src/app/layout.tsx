import { Fredoka, Nunito } from "next/font/google";
import { LoaderProvider } from "@/components/providers/LoaderProvider";
import "@/styles/globals.scss";

// Rounded, friendly faces to match the hand-drawn characters. Both are variable fonts, so no weights needed.
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-display" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });

/** Root HTML shell. Server component; only LoaderProvider runs in the browser. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <LoaderProvider>{children}</LoaderProvider>
      </body>
    </html>
  );
}
