// Static / serverless-safe API client. Runs entirely in the browser against
// the public API base (NEXT_PUBLIC_API_URL). No server key, no revalidate.
const BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const API_BASE = BASE;

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
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
  anime: (id) => get(`/anime/${id}`),
  randomAnime: () => get('/anime/random'),
  search: (keyword, page = 1) =>
    get(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}`),
  suggestion: (keyword) =>
    get(`/suggestion?keyword=${encodeURIComponent(keyword)}`),
  genre: (genre, page = 1) => get(`/genre/${genre}?page=${page}`),
  azList: (letter, page = 1) => get(`/az-list/${letter}?page=${page}`),
  producer: (id, page = 1) => get(`/producer/${id}?page=${page}`),
  explore: (query, page = 1) => get(`/${query}?page=${page}`),
  filter: (params, page = 1) => get(`/filter?${params}&page=${page}`),
  episodes: (id) => get(`/episodes/${id}`),
  servers: (episodeId) => get(`/servers/${episodeId}`),
  schedule: (id) => get(`/schedule/next/${id}`),
  scheduleByDate: (date) => get(`/schedule?date=${date}`),
  download: (episodeId, type = 'sub') =>
    get(`/download?id=${encodeURIComponent(episodeId)}&type=${type}`),
  stream: (episodeId, server = 'HD-1', type = 'sub') =>
    get(
      `/stream?id=${encodeURIComponent(episodeId)}&server=${encodeURIComponent(server)}&type=${type}`
    ),
  meta: () => get('/meta'),
};

export function slugId(href) {
  return href?.split('/').filter(Boolean).pop()?.split('?')[0] || null;
}
