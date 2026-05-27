import { redirect } from 'next/navigation'
import { getMemberUser } from '@/lib/auth'

export default async function MembersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getMemberUser()

  if (!user) {
    redirect(`/club/${slug}/login`)
  }

  if (user.club !== slug) {
    redirect(`/club/${user.club}/members`)
  }

  return <div className="min-h-screen">{children}</div>
}
