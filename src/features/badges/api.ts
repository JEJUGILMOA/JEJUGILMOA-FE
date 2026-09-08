import { apiGet } from '@/api/http'
import { badgeGroupSchema } from './schemas'
import type { BadgeGroup } from './schemas'

export async function fetchMyBadges(): Promise<BadgeGroup[]> {
  const data = await apiGet<unknown>('/badges/me')
  return badgeGroupSchema.array().parse(data)
}
