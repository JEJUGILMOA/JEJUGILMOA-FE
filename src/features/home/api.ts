import { apiGet } from '@/api/http'
import { homeCourseSchema, homePlaceSchema, type HomeCourse, type HomePlace } from './schemas'

/** GET /home/places — 오늘의 관광지 추천 (최대 5개) */
export async function fetchHomePlaces(): Promise<HomePlace[]> {
  const data = await apiGet<unknown>('/home/places')
  return homePlaceSchema.array().parse(data)
}

/** GET /home/courses — 오늘의 추천 코스 (최대 5개) */
export async function fetchHomeCourses(): Promise<HomeCourse[]> {
  const data = await apiGet<unknown>('/home/courses')
  return homeCourseSchema.array().parse(data)
}
