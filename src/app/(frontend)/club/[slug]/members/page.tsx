import Link from 'next/link'
import { getMemberUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MembersDashboard() {
  const user = await getMemberUser()

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Link href={`/club/${user?.club}`} className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Club
      </Link>
      <h1 className="text-3xl font-bold">
        Welcome, {user?.firstName}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={`/club/${user?.club}/members/search`}>
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Members Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse and search for fellow club members
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/club/${user?.club}/members/${user?.id}`}>
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your profile, score, and position
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
