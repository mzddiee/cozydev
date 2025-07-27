
import { useEffect, useState } from 'react';

export default function Radio() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetch('/api/spotify')
      .then(res => res.json())
      .then(data => {
        setPlaylists(data.playlists.items); // depends on actual response shape
      });
  }, []);

  return (
    <div>
      <h1>🎶 Lofi Vibes</h1>
      <ul>
        {playlists.map((playlist: any) => (
          <li key={playlist.id}>
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
              width="300"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
            ></iframe>
          </li>
        ))}
      </ul>
 ) : (
    
  );
    </div>
  );
}