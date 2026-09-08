import AzListClient from './Client';

const LETTERS = ['all', '0-9', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

export function generateStaticParams() {
  return LETTERS.map((letter) => ({ letter }));
}

export const metadata = {
  title: 'A–Z List | Animaze',
  description: 'Browse anime alphabetically.',
};

export default function AzListPage({ params }) {
  return <AzListClient initialLetter={params.letter} />;
}
