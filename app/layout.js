import Link from 'next/link';
import './globals.css';
import { Header, Mascot } from '../components/client';

export const metadata = {
  title: 'Animaze — Watch Anime Online',
  description: 'Watch subbed and dubbed anime online free in HD. No account needed.',
  metadataBase: new URL('https://animaze.zone.id'),
  openGraph: {
    title: 'Animaze — Watch Anime Online',
    description: 'Watch subbed and dubbed anime online free in HD. No account needed.',
    url: 'https://animaze.zone.id',
    siteName: 'Animaze',
    images: [{ url: '/mascot.png', alt: 'Animaze mascot' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animaze — Watch Anime Online',
    description: 'Watch subbed and dubbed anime online free in HD.',
    images: ['/mascot.png'],
  },
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
  ['Filter', '/filter'],
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
const AZ_LINKS = [
  ['All', '/az-list/all'],
  ['0–9', '/az-list/0-9'],
  ...'abcdefghijklmnopqrstuvwxyz'.split('').map((l) => [l.toUpperCase(), `/az-list/${l}`]),
];
const INFO_LINKS = [
  ['Terms of service', '/terms'],
  ['DMCA', '/dmca'],
  ['Guides', '/guides'],
  ['Contact', '/contact'],
  ['Request', '/request'],
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen pb-16">{children}</main>        <footer className="relative z-10 border-t border-white/5 bg-black/30">
          <div className="mx-auto max-w-7xl px-4 pt-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-sm font-black tracking-wide text-white">A–Z LIST</p>
              <span className="hidden h-4 w-px self-center bg-white/15 sm:block" />
              <p className="text-xs text-gray-400">
                Searching anime order by alphabet name A to Z.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {AZ_LINKS.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-gray-300 transition hover:bg-accent hover:text-black"
                >
                  {label}
                </Link>
              ))}
            </div>
            <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
              {INFO_LINKS.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-accent">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black tracking-tight"><span className="text-white">An</span><span className="text-accent drop-shadow-[0_0_14px_rgba(167,139,250,0.55)]">!</span><span className="text-accent">maze</span></p>
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
          <p className="border-t border-white/5 px-4 py-4 text-center text-[11px] leading-relaxed text-gray-600">
            Animaze does not store any files on its servers — all media is linked from 3rd-party services.
            <br />© Animaze — for educational and personal use only.
          </p>
        </footer>
        <Mascot />
      </body>
    </html>
  );
}
