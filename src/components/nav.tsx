'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { MemberUser } from '@/lib/auth'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'

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

  function isActive(href: string, exact = false): boolean {
    if (pathname === href) return true
    if (!exact && href !== '/' && pathname.startsWith(href + '/')) return true
    return false
  }

  function linkClasses(href: string, exact = false, extra?: string) {
    return cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive(href, exact)
        ? 'bg-secondary text-secondary-foreground'
        : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
      extra,
    )
  }

  function logo() {
    return (
      <Link
        href={ctx === 'default' ? '/' : `/club/${ctx.slug}`}
        className="text-lg font-bold tracking-tight"
      >
        Leo Club Klibia
      </Link>
    )
  }

  function navLinks() {
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
          <Link href={`/club/${ctx.slug}`} className={linkClasses(`/club/${ctx.slug}`, true)}>
            Home
          </Link>
          <Link
            href={`/club/${ctx.slug}/events`}
            className={linkClasses(`/club/${ctx.slug}/events`)}
          >
            Events
          </Link>
          <Link href={`/club/${ctx.slug}/about`} className={linkClasses(`/club/${ctx.slug}/about`)}>
            About
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href={`/club/${ctx.slug}`} className={linkClasses(`/club/${ctx.slug}`, true)}>
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
      </>
    )
  }

  function Separator() {
    return <span className="mx-0.5 h-5 w-px bg-border" />
  }

  const showLogin = ctx !== 'default' && ctx.area === 'public'
  const showUser = ctx !== 'default' && ctx.area === 'members' && user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        {logo()}
        <div className="hidden items-center md:flex gap-1">
          {navLinks()}
          {(showLogin || showUser) && <Separator />}
          {showLogin && (
            <Link
              href={`/club/${ctx.slug}/login`}
              className={cn(linkClasses(`/club/${ctx.slug}/login`), 'gap-1.5')}
            >
              <LogIn className="size-4" />
              Members
            </Link>
          )}
          {showUser && (
            <>
              <span className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-green-500" />
                {user.firstName}
              </span>
              <button
                onClick={async () => {
                  await fetch('/api/member-logout', { method: 'POST' })
                  window.location.href = `/club/${ctx.slug}`
                }}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                Logout
              </button>
            </>
          )}
          <Separator />
          <AnimatedThemeToggler />
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <AnimatedThemeToggler />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t bg-background px-4 pb-4 pt-2 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1" onClick={() => setMobileOpen(false)}>
              {navLinks()}
              {showLogin && (
                <Link
                  href={`/club/${ctx.slug}/login`}
                  className={cn(linkClasses(`/club/${ctx.slug}/login`), 'gap-1.5')}
                >
                  <LogIn className="size-4" />
                  Members
                </Link>
              )}
              {showUser && (
                <>
                  <span className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-green-500" />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function cn(...inputs: (string | false | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}
