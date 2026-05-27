import type { CollectionConfig } from 'payload'

export const ClubHistory: CollectionConfig = {
  slug: 'club-history',
  admin: {
    useAsTitle: 'title',
    group: 'Club Content',
    defaultColumns: ['year', 'title', 'club', 'updatedAt'],
    description: 'Historical milestones and achievements shown in the club timeline',
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
    read: () => true,
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => {
      if (user?.collection === 'users' && user.club) {
        return { club: { equals: user.club } }
      }
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      if (user?.collection === 'users' && user.club) {
        return { club: { equals: user.club } }
      }
      return user?.collection === 'users'
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
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Main content of this history entry',
      },
    },
    {
      name: 'isForBothClubs',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this entry on both club pages',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
