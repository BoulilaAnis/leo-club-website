'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { authedFetch } from '@/lib/client-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface MemberData {
  id: string
  firstName: string
  lastName: string
  contactEmail?: string
  bio?: string
}

export default function EditProfilePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const memberId = params.memberId as string

  const [data, setData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    authedFetch(`/api/members/${memberId}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [memberId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setError('')

    try {
      const res = await authedFetch(`/api/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          contactEmail: data.contactEmail || null,
          bio: data.bio || null,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      router.push(`/club/${slug}/members/${memberId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4 text-center text-muted-foreground">Loading...</div>
  if (!data) return <div className="p-4 text-center text-muted-foreground">Profile not found</div>

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 py-12">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={data.contactEmail || ''}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data.bio || ''}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/club/${slug}/members/${memberId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
