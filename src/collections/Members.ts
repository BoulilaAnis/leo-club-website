import type { CollectionConfig } from 'payload'
import { restrictToClub, restrictToSelf } from '@/lib/access'
import { clubField } from '@/lib/fields'
import { autoSetClub } from '@/lib/hooks'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'username',
    group: 'Club Members',
    defaultColumns: ['firstName', 'lastName', 'position', 'score', 'isActive'],
    description: 'Member accounts — each member can log in with their username and password',
  },
  auth: {
    loginWithUsername: {
      requireEmail: false,
      allowEmailLogin: false,
    },
    tokenExpiration: 7200,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && 'email' in data && !data.email) {
          delete data.email
        }
        return data
      },
    ],
    beforeChange: [autoSetClub],
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
      name: 'email',
      type: 'text',
      required: false,
      unique: false,
      admin: {
        hidden: true,
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return true
      },
    },
    clubField,
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
