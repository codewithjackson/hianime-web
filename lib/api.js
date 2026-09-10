// Static / serverless-safe API client. Runs entirely in the browser against
// the public API base (NEXT_PUBLIC_API_URL). The backend key-gates every
// /api/v1/* request, so the public key (NEXT_PUBLIC_API_KEY) is sent as
// ?apikey= — the backend accepts it there. Abuse is contained by the
// backend's per-IP rate limiter. For a private key, use a separate value.
const BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

export const API_BASE = BASE;

// Build a full API URL, attaching the public key when configured.
// Use this for any manual fetch() so no call goes out unauthorized.
export function apiUrl(path) {
  const sep = path.includes('?') ? '&' : '?';
  const suffix = PUBLIC_KEY ? `${sep}apikey=${encodeURIComponent(PUBLIC_KEY)}` : '';
  return `${BASE}${path}${suffix}`;
}

async function get(path, init) {
  const res = await fetch(apiUrl(path), init ?? { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error(`API ${res.status} for ${path}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.data;
}

// Build-time fetch (generateStaticParams/generateMetadata): force-cache keeps
// the route fully static for `output: export`. Using no-store at build time
// makes Next flag these paths as dynamic and silently skip emitting them.

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
  seasons: (id) => get(`/seasons/${id}`),
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

// Static-safe subset for build-time prerendering (see get() note above).
export const apiStatic = {
  explore: (query, page = 1) =>
    get(`/${query}?page=${page}`, { cache: 'force-cache' }),
  anime: (id) => get(`/anime/${id}`, { cache: 'force-cache' }),
};

export function slugId(href) {
  return href?.split('/').filter(Boolean).pop()?.split('?')[0] || null;
}
