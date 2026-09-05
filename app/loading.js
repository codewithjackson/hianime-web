function Shimmer({ className }) {
  return <div className={`animate-pulse rounded-xl bg-surface/70 ${className || ''}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6">
      <Shimmer className="h-64 w-full md:h-96" />
      <div className="no-scrollbar mt-8 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[132px] shrink-0 sm:w-[150px]">
            <Shimmer className="h-[210px] w-full" />
            <Shimmer className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="no-scrollbar mt-6 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[132px] shrink-0 sm:w-[150px]">
            <Shimmer className="h-[210px] w-full" />
            <Shimmer className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
