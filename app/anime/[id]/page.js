import AnimeClient from './Client';

// Anime IDs are infinite — pre-render one shell, host rewrite serves the rest.
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export const metadata = {
  title: 'Anime Details | Animaze',
  description: 'Watch anime online free in HD.',
};

export default function AnimePage({ params }) {
  return <AnimeClient initialId={params.id} />;
}
