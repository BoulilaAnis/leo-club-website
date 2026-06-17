import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getClub } from '@/lib/club'
import type { ClubHistory } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ImageWithSkeleton } from '@/components/reui/image-with-skeleton'

export default async function ClubPage({
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
    limit: 6,
  })

  const { docs: history } = await payload.find({
    collection: 'club-history',
    where: {
      or: [
        { club: { equals: slug } },
        { isForBothClubs: { equals: true } },
      ],
    },
    sort: '-year',
    limit: 10,
  })

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4 py-12 md:space-y-16">
      <section className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{club.name}</h1>
        <p className="text-lg text-muted-foreground">{club.tagline}</p>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{club.description}</p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground">No upcoming events yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/club/${slug}/events/${event.id}`}>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {event.eventDate && (
                      <p>{new Date(event.eventDate).toLocaleDateString()}</p>
                    )}
                    {event.location && <p>{event.location}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Club History</h2>
        {history.length === 0 ? (
          <p className="text-muted-foreground">No history entries yet.</p>
        ) : (
          <div className="space-y-10">
            {history.map((entry) => (
              <div key={entry.id} className="border-l-2 pl-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="text-xs font-semibold text-muted-foreground sm:text-sm">{entry.year}</span>
                  <h3 className="text-lg font-semibold sm:text-xl">{entry.title}</h3>
                </div>
                {entry.description && (
                  <div className="prose prose-sm prose-gray mt-2 max-w-none dark:prose-invert">
                    <RichText data={entry.description} />
                  </div>
                )}
                {entry.images && entry.images.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {(entry.images ?? []).map((img) => {
                    const imageUrl = typeof img.image === 'object' && img.image !== null && 'url' in img.image
                      ? img.image.url
                      : null
                    return (
                      <figure key={img.id ?? img.caption ?? ''} className="shrink-0">
                        {imageUrl && (
                          <ImageWithSkeleton
                            src={imageUrl}
                            alt={img.caption || ''}
                            width={192}
                            height={128}
                            className="rounded-lg object-cover"
                            containerClassName="h-32 w-48"
                            sizes="192px"
                          />
                        )}
                        {img.caption && (
                          <figcaption className="mt-1 text-xs text-muted-foreground">{img.caption}</figcaption>
                        )}
                      </figure>
                    )
                  })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
