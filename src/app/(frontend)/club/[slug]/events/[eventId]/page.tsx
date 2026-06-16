import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getClub } from '@/lib/club'
import { Button } from '@/components/ui/button'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; eventId: string }>
}) {
  const { slug, eventId } = await params
  const club = getClub(slug)
  const payload = await getPayload({ config: await config })

  const event = await payload.findByID({
    collection: 'events',
    id: eventId,
    depth: 1,
  })

  if (!event || (event.club !== slug && !event.isForBothClubs)) return notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 py-12">
      <div>
        <Link href={`/club/${slug}`}>
          <Button variant="ghost" className="-ml-2">&larr; Back to {club.name}</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {(event.type as any)?.name}
          </span>
          {event.eventDate && (
            <span className="text-sm text-muted-foreground">
              {new Date(event.eventDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>

        {event.location && (
          <p className="text-lg text-muted-foreground">{event.location}</p>
        )}
      </div>

      {event.image && (
        <div className="aspect-video overflow-hidden rounded-xl bg-muted">
          <img
            src={typeof event.image === 'object' && 'url' in event.image ? event.image.url ?? '' : ''}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {event.description && (
        <div className="prose prose-gray max-w-none dark:prose-invert">
          <RichText data={event.description} />
        </div>
      )}
    </div>
  )
}
