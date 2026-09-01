import { apiGet } from '@/api/http'
import { recommendedCourseSchema, type CourseTheme, type RecommendedCourse } from './schemas'

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
