import type { CollectionConfig } from 'payload'

export const Positions: CollectionConfig = {
  slug: 'positions',
  admin: {
    useAsTitle: 'name',
    group: 'Club',
    defaultColumns: ['name', 'sortOrder'],
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
