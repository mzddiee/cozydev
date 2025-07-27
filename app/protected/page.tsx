'use client'

import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-white">
      <h1 className="font-pixel text-7xl mb-6">Welcome to Cozy Dev{" "}
        <img
          src="/images/moon.png"
          alt="Moon icon"
          width={128}
          height={128}
          className="inline-block ml-2 align-middle"
        />
      </h1>
      <p className="bg-[#6ab4da] rounded-lg font-pixel mb-12 text-lg p-1">
        Where your ideas, projects, and creativity are yours.
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        {/* Projects card */}
        <Link href="/protected/projects">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyleL.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* dark overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">Projects</span>
            </div>
          </div>
        </Link>

        {/* Resources card */}
        <Link href="/protected/resources">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyleC.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">Resources</span>
            </div>
          </div>
        </Link>

        {/* DevChat card */}
        <Link href="/protected/forum">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyleC.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">DevChat</span>
            </div>
          </div>
        </Link>

        {/* Tools card */}
        <Link href="/protected/tools">
          <div
            className="relative w-40 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer"
            style={{
              backgroundImage: "url('/images/buttonstyleR.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-xl">Tools</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
