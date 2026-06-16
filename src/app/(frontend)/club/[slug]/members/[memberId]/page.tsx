import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'
import { getMemberUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/reui/timeline'

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string; memberId: string }>
}) {
  const { slug, memberId } = await params
  const currentUser = await getMemberUser()
  if (!currentUser) return notFound()

  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })

  const member = await payload.findByID({
    collection: 'members',
    id: memberId,
    depth: 1,
    req: { headers },
  })

  if (!member || member.club !== slug) return notFound()

  const isOwnProfile = member.id === currentUser.id

  const { docs: adjustments } = await payload.find({
    collection: 'score-adjustments',
    where: { member: { equals: memberId } },
    sort: '-createdAt',
    depth: 1,
    limit: 100,
    req: { headers },
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground">
          {member.firstName[0]}{member.lastName[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-muted-foreground">
            {member.position && typeof member.position === 'object'
              ? member.position.name
              : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{member.score ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Score History</h2>
        {adjustments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No score changes yet.</p>
        ) : (
          <Timeline defaultValue={adjustments.length}>
            {adjustments.map((adj, i) => {
              const amount = adj.amount as number
              const isPositive = amount >= 0

              return (
                <TimelineItem key={adj.id} step={i + 1}>
                  <TimelineHeader>
                    <TimelineDate>
                      {new Date(adj.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TimelineDate>
                    <TimelineTitle className={cn(isPositive ? 'text-green-600' : 'text-red-600', 'font-bold')}>
                      {isPositive ? '+' : ''}{amount}
                    </TimelineTitle>
                  </TimelineHeader>
                  <TimelineIndicator />
                  <TimelineSeparator />
                  <TimelineContent>
                    <p>{adj.reason as string}</p>
                    {(adj.createdBy as any)?.email && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        by {(adj.createdBy as any).email as string}
                      </p>
                    )}
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        )}
      </section>

      {isOwnProfile && member.contactEmail && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{member.contactEmail}</p>
          </CardContent>
        </Card>
      )}

      {isOwnProfile && (
        <Link href={`/club/${slug}/members/${member.id}/edit`}>
          <Button>Edit Profile</Button>
        </Link>
      )}

      {member.bio && (
        <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
      )}
    </div>
  )
}
