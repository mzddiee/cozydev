// app/page.tsx
'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">
      {/* Title with moon icon */}
      <h1 className="font-pixel text-7xl mb-6">
        Welcome to Cozy Dev{" "}
        <img
          src="/images/moon.png"
          alt="Moon icon"
          width={64}
          height={64}
          className="inline-block ml-2 align-middle"
        />
      </h1>

      {/* Subtitle */}
      <p className="bg-[#6ab4da] rounded-lg font-pixel mb-12 text-lg px-4 py-2">
        Where your ideas, projects, and creativity are yours.
      </p>

      {/* Login / Sign‑Up Buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        {/* Login */}
        <Link href="/auth/login">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyle2.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">Login</span>
            </div>
          </div>
        </Link>

        {/* Sign Up */}
        <Link href="/auth/sign-up">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyle1.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">Sign Up</span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}
