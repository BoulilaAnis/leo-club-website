import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Club Content',
    defaultColumns: ['title', 'eventDate', 'type', 'isPublic'],
    description: 'Public events shown on the club page — meetings, socials, service projects, and more',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
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
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isForBothClubs',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this event on both club pages',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide from the public club page',
      },
    },
  ],
}
