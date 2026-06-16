export default function ClubLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 p-4 py-12">
      <section className="text-center">
        <div className="mb-4 h-12 w-48 mx-auto animate-pulse rounded bg-muted" />
        <div className="h-6 w-64 mx-auto animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 mx-auto mt-2 animate-pulse rounded bg-muted" />
      </section>

      <section>
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </section>
    </div>
  )
}
