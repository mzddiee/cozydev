'use client'

import { useState } from 'react'
import {
  Github,
  BookOpen,
  Globe,
  Search as SearchIcon,
  Loader2,
} from 'lucide-react'

type EngineName = 'GitHub' | 'StackOverflow' | 'Wikipedia' | 'Google'

const ENGINES: { name: EngineName; icon: React.FC<any> }[] = [
  { name: 'GitHub', icon: Github },
  { name: 'StackOverflow', icon: BookOpen },
  { name: 'Wikipedia', icon: Globe },
  { name: 'Google', icon: Globe },
]

export default function ResourcesPage() {
  const [query, setQuery] = useState('')
  const [engine, setEngine] = useState<EngineName>('GitHub')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults([])

    try {
      switch (engine) {
        case 'GitHub': {
          const res = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(
              query
            )}&per_page=10`
          )
          if (!res.ok) throw new Error(`GitHub ${res.status}`)
          const data = await res.json()
          setResults(
            data.items.map((r: any) => ({
              title: r.full_name,
              description: r.description,
              url: r.html_url,
            }))
          )
          break
        }
        case 'StackOverflow': {
          const res = await fetch(
            `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
              query
            )}&site=stackoverflow&pagesize=10`
          )
          if (!res.ok) throw new Error(`StackOverflow ${res.status}`)
          const data = await res.json()
          setResults(
            data.items.map((q: any) => ({
              title: q.title,
              description: `${q.answer_count} answers · ${q.score} votes`,
              url: q.link,
            }))
          )
          break
        }
        case 'Wikipedia': {
          const res = await fetch(
            `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
              query
            )}&limit=10`
          )
          if (!res.ok) throw new Error(`Wikipedia ${res.status}`)
          const data = await res.json()
          setResults(
            data.pages.map((p: any) => ({
              title: p.title,
              description: p.description || p.snippet,
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
                p.key
              )}`,
            }))
          )
          break
        }
        case 'Google': {
          // fallback: open Google in new tab
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            '_blank'
          )
          return
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-pixel max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Developer's Search</h1>

{/* Engine Tabs with uniform size */}
<div className="flex justify-center space-x-4">
  {ENGINES.map((eng) => {
    const Icon = eng.icon
    const isSelected = eng.name === engine
    return (
      <button
        key={eng.name}
        onClick={() => setEngine(eng.name)}
        className={`
          flex items-center justify-center space-x-1
          text-xs font-pixel text-white truncate
          rounded-lg transition-shadow
          ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'}
        `}
        style={{
          width: '150px',      // fixed width
          height: '100px',      // fixed height
          backgroundImage: "url('/images/buttonstyle1.png')",
          backgroundSize:   '100% 100%',   // scale exactly to container
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Icon size={16} />
        <span>{eng.name}</span>
      </button>
    )
  })}
</div>


      {/* Search Bar */}
      <div className="flex">
        <div className="relative flex-1">
          <SearchIcon
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${engine}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 outline rounded-l-lg border border-gray-100 focus:outline-none focus:ring"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 bg-blue-400 outline text-white rounded-r-lg hover:bg-blue-400 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin mx-auto" size={18} />
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Results */}
      <div className="grid gap-4">
        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">No results yet.</p>
        )}
        {results.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-blue-600">
              {r.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{r.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
