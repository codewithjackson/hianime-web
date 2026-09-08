import WatchClient from './Client';

// Same as anime page: infinite IDs, one shell + host rewrite.
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export const metadata = {
  title: 'Watch Anime | Animaze',
  description: 'Watch anime episodes online free in HD.',
};

export default function WatchPage({ params }) {
  return <WatchClient initialId={params.id} />;
}
