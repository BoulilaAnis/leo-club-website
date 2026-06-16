import { notFound } from 'next/navigation'
import type { ClubSlug } from './auth'

const CLUB_INFO = {
  alpha: {
    name: 'Alpha Club',
    tagline: 'For members under 18',
    description: 'Leadership, Experience, Opportunity — building the next generation of leaders.',
  },
  omega: {
    name: 'Omega Club',
    tagline: 'For members 18 and above',
    description: 'Leadership, Experience, Opportunity — empowering young adults to serve.',
  },
} as const

export function getClub(slug: string) {
  const club = CLUB_INFO[slug as ClubSlug]
  if (!club) notFound()
  return { slug: slug as ClubSlug, ...club }
}

export function getClubInfo(slug: ClubSlug) {
  return CLUB_INFO[slug]
}

export const CLUBS = Object.entries(CLUB_INFO).map(([slug, info]) => ({
  slug: slug as ClubSlug,
  ...info,
}))
