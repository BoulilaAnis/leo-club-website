import type { CollectionConfig } from 'payload'

export const EventTypes: CollectionConfig = {
  slug: 'event-types',
  admin: {
    useAsTitle: 'name',
    group: 'Club Settings',
    defaultColumns: ['name', 'sortOrder'],
    description: 'Categories applied to events (e.g. Meeting, Social, Service, Fundraiser)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user && user.collection === 'users',
    update: ({ req: { user } }) => !!user && user.collection === 'users',
    delete: ({ req: { user } }) => !!user && user.collection === 'users',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
