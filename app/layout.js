import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Header, Mascot } from '../components/client';

export const metadata = {
  title: 'Animaze — Watch Anime Online',
  description: 'Watch subbed and dubbed anime online.',
};

const EXPLORE_LINKS = [
  ['Top Airing', '/explore/top-airing'],
  ['Most Popular', '/explore/most-popular'],
  ['Most Favorite', '/explore/most-favorite'],
  ['Recently Updated', '/explore/recently-updated'],
  ['Top Upcoming', '/explore/top-upcoming'],
  ['Movies', '/explore/movie'],
  ['TV Series', '/explore/tv'],
  ['Subbed Anime', '/explore/subbed-anime'],
  ['Dubbed Anime', '/explore/dubbed-anime'],
];

const GENRE_LINKS = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'horror',
  'romance',
  'sci-fi',
  'shounen',
  'slice-of-life',
  'sports',
  'supernatural',
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen pb-16">{children}</main>        <footer className="border-t border-white/5 bg-black/30">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
            <div>
              <p className="text-xl font-black text-white">Ani<span className="text-accent">maze</span></p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-gray-500">
                Watch subbed and dubbed anime online. Demo frontend — all content
                belongs to its original owners.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Browse
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
                {EXPLORE_LINKS.map(([label, href]) => (
                  <Link key={href} href={href} className="hover:text-accent">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Genres
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                {GENRE_LINKS.map((g) => (
                  <Link
                    key={g}
                    href={`/genre/${g}`}
                    className="rounded-full bg-white/5 px-2.5 py-1 capitalize hover:bg-accent hover:text-black"
                  >
                    {g.replaceAll('-', ' ')}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="border-t border-white/5 py-4 text-center text-[11px] text-gray-600">
            © Animaze — for educational and personal use only.
          </p>
        </footer>
        <Mascot />
        <Analytics />
      </body>
    </html>
  );
}
