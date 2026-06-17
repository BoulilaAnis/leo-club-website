import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export type ClubSlug = 'alpha' | 'omega'

export interface MemberUser {
  id: string
  username: string
  email?: string
  firstName: string
  lastName: string
  club: ClubSlug
  collection: 'members'
}

export async function getMemberUser(): Promise<MemberUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) return null

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)

  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  if (user?.collection === 'members') {
    const u = user as unknown as MemberUser
    if (u.club !== 'alpha' && u.club !== 'omega') return null
    return u
  }

  return null
}
