import { Skeleton } from '@/components/reui/skeleton'

export default function ClubLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 p-4 py-12">
      <section className="text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-48" />
        <Skeleton className="mx-auto h-6 w-64" />
        <Skeleton className="mx-auto mt-2 h-4 w-96" />
      </section>

      <section>
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  )
}
