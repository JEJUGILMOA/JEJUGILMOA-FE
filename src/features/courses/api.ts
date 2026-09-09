import { apiDelete, apiGet, apiPost } from '@/api/http'
import {
  recommendedCourseDetailSchema,
  recommendedCourseSchema,
  savedCourseDetailSchema,
  savedCourseSchema,
  type CourseSourceType,
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

export type SaveCourseParams = {
  sourceType: CourseSourceType
  /** 추천 코스면 courseId, 기록 코스면 recordId — 둘 다 문자열로 다루지만 서버는 숫자를 기대한다 */
  sourceId: string
}

/** POST /courses/saved — 코스 담기 */
export async function saveCourse({ sourceType, sourceId }: SaveCourseParams): Promise<void> {
  await apiPost('/courses/saved', { sourceType, sourceId: Number(sourceId) })
}

/** DELETE /courses/saved/{savedCourseId} — 담은 코스 삭제 */
export async function deleteSavedCourse(savedCourseId: string): Promise<void> {
  await apiDelete(`/courses/saved/${savedCourseId}`)
}
