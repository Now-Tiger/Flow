import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Flow",
  description: "Login or create an account to start generating tasks with AI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
