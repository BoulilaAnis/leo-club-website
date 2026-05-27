import type { CollectionConfig } from 'payload'

function restrictToClub(user: { club?: string | null } | null | undefined) {
  if (user?.club === 'alpha' || user?.club === 'omega') {
    return { club: { equals: user.club } }
  }
  return true
}

async function recalculateScore(payload: any, memberId: string) {
  const { docs: adjustments } = await payload.find({
    collection: 'score-adjustments',
    where: { member: { equals: memberId } },
    depth: 0,
    limit: 10000,
  })

  const total = adjustments.reduce((sum: number, adj: any) => sum + (adj.amount || 0), 0)

  await payload.update({
    collection: 'members',
    id: memberId,
    data: { score: total },
    depth: 0,
  })
}

export const ScoreAdjustments: CollectionConfig = {
  slug: 'score-adjustments',
  admin: {
    group: 'Club',
    defaultColumns: ['member', 'amount', 'reason', 'createdAt'],
    useAsTitle: 'reason',
  },
  hooks: {
    beforeChange: [
      ({ data, req: { user }, operation }) => {
        if (operation === 'create') {
          return {
            ...data,
            club: user?.club || data.club,
            createdBy: user?.id,
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req: { payload } }) => {
        const memberId = typeof doc.member === 'object' ? doc.member.id : doc.member
        if (memberId) {
          await recalculateScore(payload, memberId)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req: { payload } }) => {
        const memberId = typeof doc.member === 'object' ? doc.member.id : doc.member
        if (memberId) {
          await recalculateScore(payload, memberId)
        }
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return restrictToClub(user)
      if (user.collection === 'members') return { member: { equals: user.id } }
      return false
    },
    create: ({ req: { user } }) => !!user && user.collection === 'users',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return restrictToClub(user)
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
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      required: true,
      index: true,
    },
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
        readOnly: true,
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'reason',
      type: 'textarea',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
