export default function MembersDashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}
