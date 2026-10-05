import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Animaze',
  description: 'Animaze terms of service.',
};

const POINTS = [
  [
    'What Animaze is',
    'Animaze is a free demo front-end for discovering anime and playing streams linked from 3rd-party hosts. It is an unofficial project and is not affiliated with, endorsed by, or connected to hianime.at or any content owner.',
  ],
  [
    'No files hosted here',
    'Animaze does not store any video files on its servers. All media is linked from 3rd-party services, and availability depends on those hosts.',
  ],
  [
    'Personal use only',
    'Use Animaze for personal, educational viewing only. All titles belong to their original owners — support official releases where available.',
  ],
  [
    'No accounts, no tracking',
    'There are no accounts. Lists like Continue Watching and My List live only in your own browser and are never sent to our servers.',
  ],
  [
    'No warranties',
    'Streams, download links, and schedules are provided as-is and may break when upstream hosts change. Availability is not guaranteed.',
  ],
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 text-sm leading-relaxed text-gray-300">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Terms of Service
      </h1>
      {POINTS.map(([title, body]) => (
        <section key={title}>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="mt-1">{body}</p>
        </section>
      ))}
      <p>
        Questions about these terms?{' '}
        <Link href="/contact" className="font-bold text-accent hover:underline">
          Contact us →
        </Link>
      </p>
    </div>
  );
}
