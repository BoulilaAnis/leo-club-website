import type { CollectionConfig } from 'payload'

function restrictToClub(user: { club?: string | null } | null | undefined) {
  if (user?.club === 'alpha' || user?.club === 'omega') {
    return { club: { equals: user.club } }
  }
  return true
}

function restrictToSelf(user: { id?: string | null } | null | undefined) {
  if (user?.id) {
    return { id: { equals: user.id } }
  }
  return false
}

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'username',
    group: 'Club Members',
    defaultColumns: ['firstName', 'lastName', 'position', 'score', 'isActive'],
    description: 'Member accounts — each member can log in with their username and password',
  },
  auth: {
    loginWithUsername: true,
    tokenExpiration: 7200,
  },
  hooks: {
    beforeChange: [
      ({ data, req: { user }, operation }) => {
        if (operation === 'create' && user?.collection === 'users' && user.club) {
          return { ...data, club: user.club }
        }
        return data
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users' || user.collection === 'members') {
        return restrictToClub(user)
      }
      return false
    },
    create: ({ req: { user } }) => !!user && user.collection === 'users',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return restrictToClub(user)
      if (user.collection === 'members') return restrictToSelf(user)
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return restrictToClub(user)
      return false
    },
  },
  fields: [
    {
      name: 'club',
      type: 'select',
      required: true,
      options: [
        { label: 'Alpha (-18)', value: 'alpha' },
        { label: 'Omega (18+)', value: 'omega' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Auto-set based on your admin account',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        description: 'Used by the member to log in',
      },
    },
    {
      name: 'contactEmail',
      type: 'text',
      label: 'Contact Email',
      admin: {
        description: 'Only visible to the member themselves',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'position',
      type: 'relationship',
      relationTo: 'positions',
    },
    {
      name: 'score',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically calculated from score adjustments',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Disable to deactivate without deleting the account',
      },
    },
  ],
}
