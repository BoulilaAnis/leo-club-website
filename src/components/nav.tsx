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

  function isActive(href: string): boolean {
    if (pathname === href) return true
    if (href !== '/' && pathname.startsWith(href + '/')) return true
    return false
  }

  function linkClasses(href: string, extra?: string) {
    return cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive(href)
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      extra,
    )
  }

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
          <Link href="/" className={linkClasses('/')}>
            Home
          </Link>
          <Link href="/club/alpha" className={linkClasses('/club/alpha')}>
            Alpha
          </Link>
          <Link href="/club/omega" className={linkClasses('/club/omega')}>
            Omega
          </Link>
        </>
      )
    }

    if (ctx.area === 'public') {
      return (
        <>
          <Link href={`/club/${ctx.slug}`} className={linkClasses(`/club/${ctx.slug}`)}>
            Home
          </Link>
          <Link
            href={`/club/${ctx.slug}/events`}
            className={linkClasses(`/club/${ctx.slug}/events`)}
          >
            Events
          </Link>
          <Link
            href={`/club/${ctx.slug}/about`}
            className={linkClasses(`/club/${ctx.slug}/about`)}
          >
            About
          </Link>
          <Link
            href={`/club/${ctx.slug}/login`}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Members
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href={`/club/${ctx.slug}`} className={linkClasses(`/club/${ctx.slug}`)}>
          Home
        </Link>
        <Link
          href={`/club/${ctx.slug}/members`}
          className={linkClasses(`/club/${ctx.slug}/members`)}
        >
          Dashboard
        </Link>
        <Link
          href={`/club/${ctx.slug}/members/search`}
          className={linkClasses(`/club/${ctx.slug}/members/search`)}
        >
          Members
        </Link>
        {user && (
          <>
            <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
              <span className="hidden size-1.5 rounded-full bg-green-500 lg:inline-block" />
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={async () => {
                await fetch('/api/member-logout', { method: 'POST' })
                window.location.href = `/club/${ctx.slug}`
              }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              Logout
            </button>
          </>
        )}
      </>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />
          {logo()}
        </div>
        <div className="hidden items-center gap-1 md:flex">{links()}</div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
            {links()}
          </div>
        </div>
      )}
    </header>
  )
}

function cn(...inputs: (string | false | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}
