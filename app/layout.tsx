import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow::App",
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
  icons: { icon: "./neko.png" },
  authors: [{ name: "Tiger" }],
  openGraph: {
    title: "Flow:App",
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
      <body className="dark:bg-slate-800">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="relative overflow-hidden">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
