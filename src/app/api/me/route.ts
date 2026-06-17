import { getMemberUser } from '@/lib/auth'

export async function GET() {
  const user = await getMemberUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json({ user })
}
