import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "React Snake Game",
  description: "A classic snake game built with Next.js and React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          vt323.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}