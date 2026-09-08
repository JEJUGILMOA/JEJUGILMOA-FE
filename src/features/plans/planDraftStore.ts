import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TravelPlan } from './types'

/**
 * v2 계획 생성은 STEP1~5를 전부 로컬에서만 편집하고, STEP6 "계획 저장하기"에서 딱 한 번
 * 서버로 보낸다(신규는 POST, DRAFT 편집은 PUT). 그래서 이 구간은 react-query 뮤테이션이 아니라
 * 이 스토어에만 쓰고 읽는다 — authStore와 같은 zustand vanilla 패턴.
 *
 * `planId: 'draft'`는 "아직 서버에 없는 새 계획"을 가리키는 예약 값이다. 이미 서버에 있는
 * DRAFT 계획을 이어서 편집하는 경우엔 실제 planId를 그대로 쓴다.
 */
export const NEW_PLAN_ID = 'draft'

type PlanDraftStoreState = {
  draft: TravelPlan | null
  setDraft: (draft: TravelPlan) => void
  updateDraft: (updater: (draft: TravelPlan) => TravelPlan) => void
  clearDraft: () => void
}

/**
 * localStorage에 그대로 미러링해서, 일정·예산·미리보기 편집 중 새로고침해도 안 날아가게 한다.
 * "계획 저장하기" 성공 시 clearDraft()를 호출하는 곳(PlanPreviewPage)에서 자동으로 같이 지워진다.
 */
export const planDraftStore = createStore<PlanDraftStoreState>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      updateDraft: (updater) =>
        set((state) => (state.draft ? { draft: updater(state.draft) } : state)),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'gilmoa-plan-draft',
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
)

export function usePlanDraftStore<T>(selector: (state: PlanDraftStoreState) => T): T {
  return useStore(planDraftStore, selector)
}
