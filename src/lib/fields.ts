import type { Field } from 'payload'

export const CLUB_OPTIONS = [
  { label: 'Alpha (-18)', value: 'alpha' },
  { label: 'Omega (18+)', value: 'omega' },
] as const

export const clubField: Field = {
  name: 'club',
  type: 'select',
  required: true,
  options: CLUB_OPTIONS,
  admin: {
    position: 'sidebar',
    description: 'Auto-set based on your admin account',
  },
}
