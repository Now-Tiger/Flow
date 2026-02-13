import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskGenius - Turn Ideas Into Actionable Tasks",
  description:
    "A minimalist productivity tool for engineers and founders. Generate structured task breakdowns with AI, organize with drag-and-drop, and export instantly.",
  keywords: [
    "productivity",
    "task management",
    "AI",
    "project planning",
    "engineers",
    "founders",
  ],
  authors: [{ name: "TaskGenius" }],
  openGraph: {
    title: "TaskGenius",
    description: "Turn Ideas Into Actionable Tasks",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className="relative overflow-hidden">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
