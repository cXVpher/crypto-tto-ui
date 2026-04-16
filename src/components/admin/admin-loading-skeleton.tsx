interface AdminLoadingSkeletonProps {
  title: string;
}

export function AdminLoadingSkeleton({ title }: AdminLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-6">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded-full bg-white/8" />
          <div className="h-9 w-72 max-w-full rounded-full bg-white/10" />
          <div className="h-4 w-[32rem] max-w-full rounded-full bg-white/6" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`${title}-metric-${index}`}
            className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5"
          >
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-white/8" />
              <div className="h-8 w-28 rounded-full bg-white/10" />
              <div className="h-4 w-32 rounded-full bg-white/6" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={`${title}-panel-${index}`}
            className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5"
          >
            <div className="space-y-4">
              <div className="h-3 w-24 rounded-full bg-white/8" />
              <div className="h-7 w-52 rounded-full bg-white/10" />
              <div className="h-56 rounded-[1.5rem] bg-white/6" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
