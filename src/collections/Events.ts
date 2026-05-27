import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Club',
    defaultColumns: ['title', 'eventDate', 'type', 'isPublic'],
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'event-types',
      required: true,
    },
    {
      name: 'isForBothClubs',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
