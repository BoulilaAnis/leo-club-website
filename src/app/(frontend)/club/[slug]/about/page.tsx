import { getPayload } from 'payload'
import config from '@/payload.config'
import { getClub } from '@/lib/club'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const club = getClub(slug)
  const payload = await getPayload({ config: await config })

  const { totalDocs: memberCount } = await payload.count({
    collection: 'members',
    where: { club: { equals: slug }, isActive: { equals: true } },
  })

  const { totalDocs: eventCount } = await payload.count({
    collection: 'events',
    where: { club: { equals: slug }, isPublic: { equals: true } },
  })

  const { docs: board } = await payload.find({
    collection: 'members',
    where: {
      club: { equals: slug },
      position: { in: ['president', 'vice_president', 'secretary', 'treasurer'] },
      isActive: { equals: true },
    },
    sort: 'position',
    limit: 10,
  })

  const POSITION_LABELS: Record<string, string> = {
    president: 'President',
    vice_president: 'Vice President',
    secretary: 'Secretary',
    treasurer: 'Treasurer',
  }

  const POSITION_ORDER = ['president', 'vice_president', 'secretary', 'treasurer']
  const sortedBoard = [...board].sort((a, b) => POSITION_ORDER.indexOf(a.position as string) - POSITION_ORDER.indexOf(b.position as string))

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-4 py-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">About {club.name}</h1>
        <p className="text-lg text-muted-foreground">{club.tagline}</p>
      </div>

      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{club.description}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{memberCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Public Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{eventCount}</p>
          </CardContent>
        </Card>
      </div>

      {sortedBoard.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Board</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedBoard.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {(member.firstName as string)?.[0]}{(member.lastName as string)?.[0]}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {member.firstName as string} {member.lastName as string}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {POSITION_LABELS[member.position as string] || member.position as string}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
