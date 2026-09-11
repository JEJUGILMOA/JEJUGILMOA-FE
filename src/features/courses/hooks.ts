import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/Toast/Toast'
import { QUERY_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import {
  deleteSavedCourse,
  fetchRecommendedCourseDetail,
  fetchRecommendedCourses,
  fetchSavedCourseDetail,
  fetchSavedCourses,
  saveCourse,
  type FetchRecommendedCoursesParams,
  type SaveCourseParams,
} from './api'
import type { CourseSourceType, SavedCourse } from './schemas'

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

export function useSavedCoursesQuery(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: QUERY_KEYS.savedCourses,
    queryFn: fetchSavedCourses,
    enabled: (options?.enabled ?? true) && isAuthenticated,
  })
}

export function useSavedCourseDetailQuery(savedCourseId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.savedCourse(savedCourseId),
    queryFn: () => fetchSavedCourseDetail(savedCourseId),
    enabled: Boolean(savedCourseId),
  })
}

/** 담은 코스 목록에서 원본(source)과 매칭 — sourceId가 있으면 우선, 없으면 제목 fallback */
export function findSavedCourseMatch(
  savedCourses: SavedCourse[] | undefined,
  params: { sourceType: CourseSourceType; sourceId: string; title?: string },
): SavedCourse | undefined {
  if (!savedCourses?.length) return undefined
  const bySourceId = savedCourses.find(
    (course) =>
      course.sourceType === params.sourceType &&
      course.sourceId != null &&
      course.sourceId === params.sourceId,
  )
  if (bySourceId) return bySourceId
  if (!params.title) return undefined
  return savedCourses.find(
    (course) => course.sourceType === params.sourceType && course.title === params.title,
  )
}

export function useSaveCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveCourse,
    onSuccess: () => {
      toast.success('코스를 즐겨찾기에 추가했어요')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
    },
    onError: () => {
      toast.error('즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.')
    },
  })
}

export function useDeleteSavedCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (savedCourseId: string) => deleteSavedCourse(savedCourseId),
    onSuccess: () => {
      toast.success('코스 즐겨찾기를 해제했어요')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
    },
    onError: () => {
      toast.error('즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.')
    },
  })
}

/** 추천 코스 상세용 즐겨찾기 토글 (POST /courses/saved ↔ DELETE /courses/saved/{id}) */
export function useToggleCourseFavoriteMutation() {
  const queryClient = useQueryClient()
  const saveMutation = useSaveCourseMutation()
  const deleteMutation = useDeleteSavedCourseMutation()

  return {
    isPending: saveMutation.isPending || deleteMutation.isPending,
    mutate: (
      input: {
        nextFavorite: boolean
        saveParams: SaveCourseParams
        savedCourseId?: string
      },
      options?: { onSuccess?: () => void },
    ) => {
      if (input.nextFavorite) {
        saveMutation.mutate(input.saveParams, { onSuccess: options?.onSuccess })
        return
      }
      if (!input.savedCourseId) {
        toast.error('즐겨찾기 정보를 찾지 못했어요. 잠시 후 다시 시도해 주세요.')
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
        return
      }
      deleteMutation.mutate(input.savedCourseId, { onSuccess: options?.onSuccess })
    },
  }
}
