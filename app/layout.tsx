// app/protected/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import PomodoroTimer from "@/components/Timerwidget";
import SearchWidget from "@/components/Search-widget";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased relative min-h-screen`}
      >
        {/* full‑screen protected‑area background */}
        <div
          className="
            absolute inset-0 
            -z-10 
            bg-[url('/images/background.png')] 
            bg-cover 
            bg-center
          "
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
           <div className="fixed bottom-6 right-6 z-50">
            <PomodoroTimer />
          </div>
          <SearchWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
