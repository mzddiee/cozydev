'use client'
import { useState } from 'react'

type EngineName = 'GitHub' | 'StackOverflow' | 'Wikipedia' | 'Google'

export default function SearchWidget() {
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
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`
          )
          if (!res.ok) throw new Error(`GitHub ${res.status}`)
          const data = await res.json()
          setResults(
            data.items.map((r: any) => ({
              title: r.full_name,
              description: r.description,
              url: r.html_url
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
              url: q.link
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
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.key)}`
            }))
          )
          break
        }
        default: {
          // Fallback: open Google
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
    <div className="p-4 max-w-xl mx-auto bg-white shadow-xl rounded-xl text-center space-y-4">
      <h2 className="text-xl font-bold">Developer Search</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your query…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <select
          value={engine}
          onChange={e => setEngine(e.target.value as EngineName)}
          className="border rounded px-3 py-2"
        >
          <option>GitHub</option>
          <option>StackOverflow</option>
          <option>Wikipedia</option>
          <option>Google</option>
        </select>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching…' : `Search ${engine}`}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Results */}
      <ul className="text-left space-y-4 mt-4">
        {results.map((r, i) => (
          <li key={i} className="border-b pb-2">
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold underline"
            >
              {r.title}
            </a>
            <p className="text-sm text-gray-600">{r.description}</p>
          </li>
        ))}
        {!loading && !results.length && (
          <p className="text-gray-500">No results yet.</p>
        )}
      </ul>
    </div>
  )
}
