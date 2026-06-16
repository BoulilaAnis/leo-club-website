import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.json()

  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const username = body.username.trim()
  const password = body.password

  if (!username || !password) {
    return Response.json({ error: 'Username and password are required' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const { token, user } = await payload.login({
      collection: 'members',
      data: { username, password },
    })

    if (!token) {
      return Response.json({ error: 'Login failed' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set('member-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200,
      path: '/',
    })

    return Response.json({ user })
  } catch {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
