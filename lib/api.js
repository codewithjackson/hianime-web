// Server-side base URL + key. API_URL/API_KEY are server-only env vars so the
// key never ships to browsers. NEXT_PUBLIC_API_URL is the public fallback.
const BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const KEY = process.env.API_KEY;

async function get(path, revalidate = 300) {
  const opts = revalidate > 0 ? { next: { revalidate } } : { cache: 'no-store' };
  if (KEY) opts.headers = { 'x-api-key': KEY };
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = new Error(`API ${res.status} for ${path}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.data;
}

export const api = {
  home: () => get('/home'),
  spotlight: () => get('/spotlight'),
  topten: () => get('/topten'),
  anime: (id) => get(`/anime/${id}`, 3600),
  randomAnime: () => get('/anime/random', 0),
  search: (keyword, page = 1) =>
    get(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`, 300),
  suggestion: (keyword) =>
    get(`/suggestion?keyword=${encodeURIComponent(keyword)}`, 300),
  genre: (genre, page = 1) => get(`/genre/${genre}?page=${page}`, 600),
  azList: (letter, page = 1) => get(`/az-list/${letter}?page=${page}`, 600),
  producer: (id, page = 1) => get(`/producer/${id}?page=${page}`, 600),
  explore: (query, page = 1) => get(`/${query}?page=${page}`, 600),
  filter: (params, page = 1) => get(`/filter?${params}&page=${page}`, 300),
  episodes: (id) => get(`/episodes/${id}`, 900),
  servers: (episodeId) => get(`/servers/${episodeId}`, 900),
  schedule: (id) => get(`/schedule/next/${id}`, 1800),
  stream: (episodeId, server = 'HD-1', type = 'sub') =>
    get(
      `/stream?id=${encodeURIComponent(episodeId)}&server=${encodeURIComponent(server)}&type=${type}`,
      300
    ),
  meta: () => get('/meta', 3600),
};

export function slugId(href) {
  return href?.split('/').filter(Boolean).pop()?.split('?')[0] || null;
}
