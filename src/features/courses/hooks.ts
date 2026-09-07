import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  fetchRecommendedCourseDetail,
  fetchRecommendedCourses,
  type FetchRecommendedCoursesParams,
} from './api'

export function useRecommendedCoursesQuery(params?: FetchRecommendedCoursesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.recommendedCourses(params?.themes),
    queryFn: () => fetchRecommendedCourses(params),
  })
}

export function useRecommendedCourseDetailQuery(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.recommendedCourse(courseId),
    queryFn: () => fetchRecommendedCourseDetail(courseId),
    enabled: Boolean(courseId),
  })
}
