import { cookies } from 'next/headers'
import { getMemberUser } from '@/lib/auth'

export async function POST() {
  const user = await getMemberUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const cookieStore = await cookies()
  cookieStore.set('payload-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return Response.json({ ok: true })
}
