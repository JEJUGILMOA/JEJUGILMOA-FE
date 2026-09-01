import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchRecommendedCourses, type FetchRecommendedCoursesParams } from './api'

export function useRecommendedCoursesQuery(params?: FetchRecommendedCoursesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.recommendedCourses(params?.themes),
    queryFn: () => fetchRecommendedCourses(params),
  })
}
