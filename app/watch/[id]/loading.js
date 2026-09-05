export default function WatchLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6">
      <div className="aspect-video w-full rounded-2xl bg-surface/70" />
      <div className="mt-3 flex gap-2">
        <div className="h-8 w-20 rounded-full bg-surface/70" />
        <div className="h-8 w-20 rounded-full bg-surface/70" />
        <div className="h-8 w-20 rounded-full bg-surface/70" />
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-surface/70" />
        ))}
      </div>
    </div>
  );
}
