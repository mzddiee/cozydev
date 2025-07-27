'use client';
import { useEffect, useState } from 'react';

export default function SpotifyWidget() {
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch('/api/spotify');
        const data = await res.json();
        const firstPlaylist = data.playlists.items[0];
        setPlaylistId(firstPlaylist.id);
        setPlaylistName(firstPlaylist.name);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }

    fetchPlaylists();
  }, []);

  if (!playlistId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white rounded-2xl p-4 w-full max-w-sm shadow-xl backdrop-blur-md border border-neutral-700">
      <h2 className="text-lg font-bold mb-2">🎧 {playlistName}</h2>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      ></iframe>
    </div>
  );
}
