import GenreClient from './Client';

export function generateStaticParams() {
  return [
    'action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror',
    'romance', 'sci-fi', 'shounen', 'slice-of-life', 'sports', 'supernatural',
  ].map((genre) => ({ genre }));
}

export const metadata = {
  title: 'Genre Anime | Animaze',
  description: 'Watch anime by genre online free in HD.',
};

export default function GenrePage({ params }) {
  return <GenreClient initialGenre={params.genre} />;
}
