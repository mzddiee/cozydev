// app/protected/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CozyDev",
  description:
    "A personalized productivity dashboard for developers to relax, search, and build — all in one cozy tab.",
  icons: {
    // favicon for most browsers
    icon: "/images/moon.png",
    // legacy “shortcut icon”
    shortcut: "/images/moon.png",
    // apple touch icon for iOS
    apple: "/images/moon.png",
  },
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
