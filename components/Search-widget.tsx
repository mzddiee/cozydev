'use client'
import { useState } from 'react';

const searchEngines = {
  Google: 'https://www.google.com/search?q=',
  GitHub: 'https://github.com/search?q=',
  Wikipedia: 'https://en.wikipedia.org/wiki/Special:Search?search=',
  Cozy: 'https://cozy.dev/search?q=' // Update this if necessary
};

type EngineName = keyof typeof searchEngines;

export default function SearchWidget() {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<EngineName>('Google');

  const handleSearch = () => {
    if (!query) return;
    const base = searchEngines[engine]; // ✅ This will now be type-safe
    const url = `${base}${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-xl rounded-xl text-center space-y-4">
      <h2 className="text-xl font-bold">Universal Search</h2>

      <input
        type="text"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />

      <select
        value={engine}
        onChange={(e) => setEngine(e.target.value as EngineName)}
        className="w-full border rounded px-3 py-2"
      >
        {Object.keys(searchEngines).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Search on {engine}
      </button>
    </div>
  );
}
