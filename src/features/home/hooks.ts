import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchHomeCourses, fetchHomePlaces } from './api'

export function useHomePlacesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.homePlaces,
    queryFn: fetchHomePlaces,
  })
}

export function useHomeCoursesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.homeCourses,
    queryFn: fetchHomeCourses,
  })
}
