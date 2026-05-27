import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getClub } from '@/lib/club'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TYPE_BADGES: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  fundraiser: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  trip: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const club = getClub(slug)
  const payload = await getPayload({ config: await config })

  const { docs: events } = await payload.find({
    collection: 'events',
    where: {
      or: [
        { club: { equals: slug } },
        { isForBothClubs: { equals: true } },
      ],
      isPublic: { equals: true },
    },
    sort: '-eventDate',
    limit: 50,
  })

  const past = events.filter((e) => e.eventDate && new Date(e.eventDate) < new Date())
  const upcoming = events.filter((e) => !e.eventDate || new Date(e.eventDate) >= new Date())

  function EventCard({ event }: { event: any }) {
    return (
      <Link href={`/club/${slug}/events/${event.id}`}>
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg">{event.title as string}</CardTitle>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGES[event.type as string] || TYPE_BADGES.other}`}>
                {event.type as string}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm text-muted-foreground">
            {event.eventDate && (
              <p>{new Date(event.eventDate as string).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            )}
            {event.location && <p>{event.location as string}</p>}
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-4 py-12">
      <div className="space-y-2">
        <Link href={`/club/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">&larr; Back to {club.name}</Link>
        <h1 className="text-4xl font-bold tracking-tight">Events</h1>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Upcoming</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Past Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {past.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="text-muted-foreground">No events yet.</p>
      )}
    </div>
  )
}
