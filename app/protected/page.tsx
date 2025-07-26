'use client'

import Link from 'next/link'

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Cozy Dev 🌙</h1>
      <p className="mb-12 text-lg">Where your ideas, projects, and purpose align.</p>
      
      <div className="flex gap-6">
        <Link href="/protected/projects">
          <button className="bg-muted text-white px-6 py-3 rounded-lg font-semibold">
            Project Management
          </button>
        </Link>
        <Link href="/protected/resources">
          <button className="bg-muted px-6 py-3 rounded-lg font-semibold">
            Resources
          </button>
        </Link>
        <Link href="/protected/forum">
          <button className="bg-muted px-6 py-3 rounded-lg font-semibold">
            DevChat
          </button>
        </Link>
                <Link href="/protected/tools">
          <button className="bg-muted px-6 py-3 rounded-lg font-semibold">
            Tools
          </button>
        </Link>
      </div>
    </div>
  )
}