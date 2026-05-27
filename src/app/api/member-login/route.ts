import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const payload = await getPayload({ config: configPromise })

  try {
    const { token, user } = await payload.login({
      collection: 'members',
      data: { username, password },
    })

    return Response.json({ token, user })
  } catch {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
