import ExploreClient from './Client';

const QUERIES = [
  'top-airing', 'most-popular', 'most-favorite', 'completed',
  'recently-added', 'recently-updated', 'top-upcoming', 'subbed-anime',
  'dubbed-anime', 'movie', 'tv', 'ova', 'ona', 'special',
];

export function generateStaticParams() {
  return QUERIES.map((query) => ({ query }));
}

export const metadata = {
  title: 'Explore Anime | Animaze',
  description: 'Browse anime collections online free in HD.',
};

export default function ExplorePage({ params }) {
  return <ExploreClient initialQuery={params.query} />;
}
