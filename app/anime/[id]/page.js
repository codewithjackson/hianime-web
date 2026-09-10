import AnimeClient from './Client';
import { apiStatic } from '../../../lib/api';

// Pre-render the most-shared anime so link previews (WhatsApp/Telegram/X)
// carry the real title, description and poster. Anything can fail at build
// time (API asleep, scrape slow) — so every step falls back to the
// placeholder shell instead of breaking the deployment.
const PREVIEW_LISTS = ['top-airing', 'most-popular', 'most-favorite'];
const MAX_PREVIEW_PAGES = 80;

export async function generateStaticParams() {
  try {
    const pages = await Promise.all(
      PREVIEW_LISTS.flatMap((q) => [
        apiStatic.explore(q, 1).catch(() => null),
        apiStatic.explore(q, 2).catch(() => null),
      ])
    );
    const ids = new Set(['placeholder']);
    for (const d of pages) {
      for (const a of d?.response || []) {
        if (a?.id) ids.add(a.id);
        if (ids.size > MAX_PREVIEW_PAGES) break;
      }
      if (ids.size > MAX_PREVIEW_PAGES) break;
    }
    return [...ids].map((id) => ({ id }));
  } catch {
    return [{ id: 'placeholder' }];
  }
}

export async function generateMetadata({ params }) {
  const fallback = {
    title: 'Anime Details | Animaze',
    description: 'Watch anime online free in HD.',
  };
  if (!params?.id || params.id === 'placeholder') return fallback;
  try {
    const a = await apiStatic.anime(params.id);
    const desc = (a.synopsis || `Watch ${a.title} online free in HD.`).slice(0, 160);
    return {
      title: `${a.title} — Watch Online | Animaze`,
      description: desc,
      openGraph: {
        title: a.title,
        description: desc,
        images: a.poster ? [a.poster] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: a.title,
        description: desc,
        images: a.poster ? [a.poster] : [],
      },
    };
  } catch {
    return fallback;
  }
}

export default function AnimePage({ params }) {
  return <AnimeClient initialId={params.id} />;
}
