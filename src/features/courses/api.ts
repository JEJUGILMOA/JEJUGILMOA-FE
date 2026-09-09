import { apiGet } from '@/api/http'
import {
  recommendedCourseDetailSchema,
  recommendedCourseSchema,
  savedCourseDetailSchema,
  savedCourseSchema,
  type CourseTheme,
  type RecommendedCourse,
  type RecommendedCourseDetail,
  type SavedCourse,
  type SavedCourseDetail,
} from './schemas'

export type FetchRecommendedCoursesParams = {
  /** 테마 필터. 미입력 시 전체 (담기 횟수 내림차순) */
  themes?: CourseTheme[]
}

/** GET /courses/recommended */
export async function fetchRecommendedCourses(
  params?: FetchRecommendedCoursesParams,
): Promise<RecommendedCourse[]> {
  const data = await apiGet<unknown>('/courses/recommended', {
    params: params?.themes?.length ? { themes: params.themes } : undefined,
    paramsSerializer: {
      indexes: null,
    },
  })
  return recommendedCourseSchema.array().parse(data)
}

/** GET /courses/recommended/{courseId} */
export async function fetchRecommendedCourseDetail(
  courseId: string,
): Promise<RecommendedCourseDetail> {
  const data = await apiGet<unknown>(`/courses/recommended/${courseId}`)
  return recommendedCourseDetailSchema.parse(data)
}

/** GET /courses/saved — 담은 코스 목록 조회 (최신순) */
export async function fetchSavedCourses(): Promise<SavedCourse[]> {
  const data = await apiGet<unknown>('/courses/saved')
  return savedCourseSchema.array().parse(data)
}

/** GET /courses/saved/{savedCourseId}/detail */
export async function fetchSavedCourseDetail(savedCourseId: string): Promise<SavedCourseDetail> {
  const data = await apiGet<unknown>(`/courses/saved/${savedCourseId}/detail`)
  return savedCourseDetailSchema.parse(data)
}
