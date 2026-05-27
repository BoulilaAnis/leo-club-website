import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getClub } from '@/lib/club'
import { Button } from '@/components/ui/button'

const TYPE_BADGES: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  fundraiser: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  trip: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

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
  })

  if (!event || event.club !== slug) return notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 py-12">
      <div>
        <Link href={`/club/${slug}`}>
          <Button variant="ghost" className="-ml-2">&larr; Back to {club.name}</Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${TYPE_BADGES[event.type as string] || TYPE_BADGES.other}`}>
            {event.type as string}
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

        <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>

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
