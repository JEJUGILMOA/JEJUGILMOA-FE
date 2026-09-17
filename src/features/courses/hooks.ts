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

function optimisticSavedCourseId(params: SaveCourseParams) {
  return `optimistic-${params.sourceType}-${params.sourceId}`
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

type ToggleCourseFavoriteInput = {
  nextFavorite: boolean
  saveParams: SaveCourseParams
  /** 해제 시 서버 savedCourseId. 낙관적 추가분 해제는 sourceId로도 매칭한다 */
  savedCourseId?: string
  /** 낙관적 추가 시 카드 매칭용 제목 */
  title?: string
}

/** 코스 즐겨찾기 토글 — savedCourses 캐시 낙관적 업데이트 */
export function useToggleCourseFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ToggleCourseFavoriteInput) => {
      if (input.nextFavorite) {
        await saveCourse(input.saveParams)
        return
      }
      const savedCourseId = input.savedCourseId
      if (!savedCourseId || savedCourseId.startsWith('optimistic-')) {
        throw new Error('MISSING_SAVED_COURSE_ID')
      }
      await deleteSavedCourse(savedCourseId)
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.savedCourses })
      const previous = queryClient.getQueryData<SavedCourse[]>(QUERY_KEYS.savedCourses)
      const current = previous ? [...previous] : []

      if (input.nextFavorite) {
        const stub: SavedCourse = {
          savedCourseId: optimisticSavedCourseId(input.saveParams),
          sourceType: input.saveParams.sourceType,
          sourceId: input.saveParams.sourceId,
          title: input.title ?? '',
          imageUrl: undefined,
          region: undefined,
          placeCount: undefined,
          estimatedMinutes: undefined,
          theme: undefined,
          description: undefined,
          copyCount: undefined,
          waypoints: [],
        }
        queryClient.setQueryData<SavedCourse[]>(QUERY_KEYS.savedCourses, [
          stub,
          ...current.filter(
            (course) =>
              !(
                course.sourceType === input.saveParams.sourceType &&
                course.sourceId === input.saveParams.sourceId
              ),
          ),
        ])
      } else {
        queryClient.setQueryData<SavedCourse[]>(
          QUERY_KEYS.savedCourses,
          current.filter((course) => {
            if (input.savedCourseId && course.savedCourseId === input.savedCourseId) return false
            if (
              course.sourceType === input.saveParams.sourceType &&
              course.sourceId === input.saveParams.sourceId
            ) {
              return false
            }
            return true
          }),
        )
      }

      return { previous }
    },
    onError: (error, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.savedCourses, context.previous)
      }
      if (error instanceof Error && error.message === 'MISSING_SAVED_COURSE_ID') {
        toast.error('즐겨찾기 정보를 찾지 못했어요. 잠시 후 다시 시도해 주세요.')
        return
      }
      toast.error(
        input.nextFavorite
          ? '즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.'
          : '즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.',
      )
    },
    onSuccess: (_data, input) => {
      toast.success(
        input.nextFavorite ? '코스를 즐겨찾기에 추가했어요' : '코스 즐겨찾기를 해제했어요',
      )
    },
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedCourses })
      if (variables.savedCourseId && !variables.savedCourseId.startsWith('optimistic-')) {
        void queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.savedCourse(variables.savedCourseId),
        })
      }
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myProfile })
    },
  })
}
