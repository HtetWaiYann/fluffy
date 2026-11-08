/**
 * Root layout: the single HTML shell for the page.
 * Fonts, metadata and providers are added in later steps.
 * @param props.children - The page content.
 * @returns The `<html>` and `<body>` shell.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
