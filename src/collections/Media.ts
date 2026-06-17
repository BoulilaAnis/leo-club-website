import type { CollectionConfig } from 'payload'
import { isClubAdmin } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'createdAt'],
    description: 'Images used across the site — event photos, member avatars, history images',
  },
  access: {
    read: () => true,
    create: isClubAdmin,
    update: isClubAdmin,
    delete: isClubAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
}
