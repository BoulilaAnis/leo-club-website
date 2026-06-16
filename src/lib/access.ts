import type { Access } from 'payload'

type UserWithClub = { club?: string | null }
type UserWithId = { id?: string | null }

export function restrictToClub(user: UserWithClub & { collection?: string } | null | undefined) {
  if (user?.club === 'alpha' || user?.club === 'omega') {
    return { club: { equals: user.club } }
  }
  if (user?.collection === 'users' && !user?.club) {
    return true
  }
  return false
}

export function restrictToSelf(user: UserWithId | null | undefined) {
  return user?.id ? { id: { equals: user.id } } : false
}

export const isAdmin: Access = ({ req: { user } }) => {
  return !!user && user.collection === 'users'
}

export const isClubAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection !== 'users') return false
  return restrictToClub(user)
}

export const isMemberOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return restrictToClub(user)
  if (user.collection === 'members') return restrictToSelf(user)
  return false
}

export const isOwner: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return restrictToClub(user)
  return false
}
