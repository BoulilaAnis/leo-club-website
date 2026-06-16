import type { CollectionConfig } from 'payload'
import { restrictToClub } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'club'],
    description: 'Administrators who manage the club and its content',
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return restrictToClub(user)
    },
    create: ({ req: { user } }) => {
      if (!user) return true
      return !user.club
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      if (!user.club) return true
      return restrictToClub(user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return !user.club
    },
    admin: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return !!user
    },
  },
  fields: [
    {
      name: 'club',
      type: 'select',
      options: [
        { label: 'Alpha (-18)', value: 'alpha' },
        { label: 'Omega (18+)', value: 'omega' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Leave empty for super admin access to both clubs',
      },
    },
  ],
}
