import type { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from  '../../lib/Spotify.lib';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getAccessToken();

  const spotifyRes = await fetch(
    'https://api.spotify.com/v1/browse/categories/lofi/playlists?limit=5',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await spotifyRes.json();
  res.status(200).json(data);
}