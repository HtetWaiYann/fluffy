import { LoaderProvider } from "@/components/providers/LoaderProvider";

/** Root HTML shell. Server component; only LoaderProvider runs in the browser. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <LoaderProvider>{children}</LoaderProvider>
      </body>
    </html>
  );
}
