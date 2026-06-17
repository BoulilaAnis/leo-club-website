'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { authedFetch } from '@/lib/client-auth'

interface MemberResult {
  id: string
  firstName: string
  lastName: string
  username: string
  avatar?: { url?: string } | string | null
  position: string | { name: string } | null
  score: number
  club: string
}

const POSITION_LABELS: Record<string, string> = {
  president: 'President',
  vice_president: 'Vice President',
  secretary: 'Secretary',
  treasurer: 'Treasurer',
  board_member: 'Board Member',
  active_member: 'Active Member',
  new_member: 'New Member',
}

export default function MemberSearchPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [members, setMembers] = useState<MemberResult[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    authedFetch('/api/members?depth=1')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch members')
        return res.json()
      })
      .then((data) => {
        setMembers(data.docs ?? [])
      })
      .catch((err) => {
        console.error('Failed to load members:', err)
        setFetchError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = members.filter((m) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q)
    )
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Link href={`/club/${slug}/members`} className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold">Members</h1>

      <Input
        placeholder="Search by name or username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : fetchError ? (
        <p className="text-sm text-destructive">Failed to load members. Please try again.</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No members found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <button
              key={member.id}
              onClick={() => router.push(`/club/${slug}/members/${member.id}`)}
              className="w-full text-left"
            >
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Avatar
                    src={typeof member.avatar === 'object' ? member.avatar?.url : null}
                    fallback={`${member.firstName[0]}${member.lastName[0]}`}
                    className="h-9 w-9 shrink-0 text-sm"
                  />
                  <CardTitle className="text-base">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>@{member.username}</p>
                  <p>{typeof member.position === 'object' && member.position !== null
                    ? member.position.name
                    : POSITION_LABELS[member.position as string] || member.position}</p>
                  <p>Score: {member.score}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
