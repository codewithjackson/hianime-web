import Link from 'next/link';

export const metadata = {
  title: 'Guides | Animaze',
  description: 'How to use Animaze: search, servers, downloads, lists.',
};

const GUIDES = [
  [
    'Find something to watch',
    'Use the search bar (with live suggestions), browse by genre or studio, walk the A–Z list in the footer, or hit the 🎲 dice for a random pick.',
  ],
  [
    'If a server doesn\u2019t play',
    'Animaze tries servers for you automatically and moves to the next one if the current embed is dead — watch the status line above the server list. You can also pick any SUB / DUB server manually, or step with the Ep ← / Ep → buttons.',
  ],
  [
    'Download an episode',
    'Open the DL row in the server box (e.g. Kiwi Sub), pick a quality, and the file host opens in a new tab. Files come from 3rd-party hosts, so availability varies.',
  ],
  [
    'Keep a list without an account',
    'Tap + Add to List on any anime to save it to My List, stored privately in your browser. Playback progress is remembered the same way under Continue Watching on the home page.',
  ],
  [
    'Sub or dub?',
    'The SUB / DUB badges on every poster show episode counts per track. The watch page remembers your last choice per episode link (?type=sub or &type=dub).',
  ],
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 text-sm leading-relaxed text-gray-300">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
        <span className="h-6 w-1 rounded bg-accent" /> Guides
      </h1>
      {GUIDES.map(([title, body], i) => (
        <section key={title}>
          <h2 className="text-base font-bold text-white">
            {i + 1}/ {title}
          </h2>
          <p className="mt-1">{body}</p>
        </section>
      ))}
      <Link
        href="/home"
        className="inline-block rounded-full bg-accent px-6 py-2 text-sm font-bold text-black transition hover:brightness-110"
      >
        Start watching →
      </Link>
    </div>
  );
}
