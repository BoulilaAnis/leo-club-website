import type { CollectionBeforeChangeHook } from 'payload'

export const autoSetClub: CollectionBeforeChangeHook = ({ data, req: { user }, operation }) => {
  if (operation === 'create' && user?.collection === 'users' && user.club) {
    return { ...data, club: user.club }
  }
  return data
}
