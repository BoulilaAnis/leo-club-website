import type { CollectionConfig } from 'payload'

export const ClubHistory: CollectionConfig = {
  slug: 'club-history',
  admin: {
    useAsTitle: 'title',
    group: 'Club',
    defaultColumns: ['year', 'title'],
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
