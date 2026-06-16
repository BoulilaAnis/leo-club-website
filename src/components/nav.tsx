'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { MemberUser } from '@/lib/auth'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'

const CLUB_INFO = {
  alpha: { name: 'Alpha Club', tagline: '-18', color: 'text-blue-600' },
  omega: { name: 'Omega Club', tagline: '18+', color: 'text-purple-600' },
} as const

type NavContext = 'default' | { slug: 'alpha' | 'omega'; area: 'public' | 'members' }

function detectContext(pathname: string): NavContext {
  const match = pathname.match(/^\/club\/(alpha|omega)(\/|$)/)
  if (!match) return 'default'
  const slug = match[1] as 'alpha' | 'omega'
  const area = pathname.includes('/members') ? 'members' : 'public'
  return { slug, area }
}

export default function Nav({ user }: { user?: MemberUser | null }) {
  const pathname = usePathname()
  if (pathname === '/') return null
  const ctx = detectContext(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  function logo() {
    if (ctx === 'default') {
      return (
        <Link href="/" className="text-xl font-bold tracking-tight">
          Leo Club Klibia
        </Link>
      )
    }
    return (
      <div className="flex items-baseline gap-2">
        <Link
          href={`/club/${ctx.slug}`}
          className={`text-xl font-bold tracking-tight ${CLUB_INFO[ctx.slug].color}`}
        >
          {CLUB_INFO[ctx.slug].name}
        </Link>
        <span className="hidden text-xs text-muted-foreground sm:inline">Leo Club Klibia</span>
      </div>
    )
  }

  function links() {
    if (ctx === 'default') {
      return (
        <>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/club/alpha" className="hover:underline">
            Alpha
          </Link>
          <Link href="/club/omega" className="hover:underline">
            Omega
          </Link>
        </>
      )
    }

    if (ctx.area === 'public') {
      return (
        <>
          <Link href={`/club/${ctx.slug}`} className="hover:underline">
            Home
          </Link>
          <Link href={`/club/${ctx.slug}/events`} className="hover:underline">
            Events
          </Link>
          <Link href={`/club/${ctx.slug}/about`} className="hover:underline">
            About
          </Link>
          <Link
            href={`/club/${ctx.slug}/login`}
            className="rounded-md bg-foreground px-3 py-1.5 text-background text-sm font-medium hover:opacity-90"
          >
            Members
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href={`/club/${ctx.slug}`} className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <Link
          href={`/club/${ctx.slug}/members`}
          className="text-muted-foreground hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href={`/club/${ctx.slug}/members/search`}
          className="text-muted-foreground hover:text-foreground"
        >
          Members
        </Link>
        {user && (
          <>
            <span className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={async () => {
                await fetch('/api/member-logout', { method: 'POST' })
                window.location.href = `/club/${ctx.slug}`
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </>
        )}
      </>
    )
  }

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-secondary p-1">
            <AnimatedThemeToggler />
          </div>
          {logo()}
        </div>
        <div className="relative hidden md:block">
          <Link className="text-primary text-3xl" href="/">
            Leo Club
          </Link>
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary animate-caret-blink" />
        </div>
        <div className="hidden items-center gap-4 text-sm md:flex">{links()}</div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-9 items-center justify-center md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3" onClick={() => setMobileOpen(false)}>
            <Link className="text-primary text-lg font-semibold" href="/">
              Leo Club
            </Link>
            {links()}
          </div>
        </div>
      )}
    </header>
  )
}
