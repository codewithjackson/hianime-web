import StudiosClient from './Client';

// Infinite studio IDs can't be pre-rendered; one shell + host rewrite covers the rest.
export function generateStaticParams() {
  return [{ id: 'toei-animation' }];
}

export const metadata = {
  title: 'Studio Anime | Animaze',
  description: 'Watch anime by studio online free in HD.',
};

export default function StudiosPage({ params }) {
  return <StudiosClient initialId={params.id} />;
}
