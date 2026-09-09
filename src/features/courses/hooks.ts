import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/Toast/Toast'
import { QUERY_KEYS } from '@/constants'
import {
  deleteSavedCourse,
  fetchRecommendedCourseDetail,
  fetchRecommendedCourses,
  fetchSavedCourseDetail,
  fetchSavedCourses,
  saveCourse,
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

export function useSavedCoursesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.savedCourses,
    queryFn: fetchSavedCourses,
  })
}

export function useSavedCourseDetailQuery(savedCourseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.savedCourse(savedCourseId),
    queryFn: () => fetchSavedCourseDetail(savedCourseId),
    enabled: Boolean(savedCourseId),
  })
}

export function useSaveCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveCourse,
    onSuccess: () => {
      toast.success('코스를 저장했어요')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
    },
    onError: () => {
      toast.error('코스 저장에 실패했어요. 다시 시도해 주세요.')
    },
  })
}

export function useDeleteSavedCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (savedCourseId: string) => deleteSavedCourse(savedCourseId),
    onSuccess: () => {
      toast.success('저장한 코스에서 삭제했어요')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
    },
    onError: () => {
      toast.error('삭제에 실패했어요. 다시 시도해 주세요.')
    },
  })
}
