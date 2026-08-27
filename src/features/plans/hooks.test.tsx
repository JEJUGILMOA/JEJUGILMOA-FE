import { afterEach, describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/test/test-utils'
import { mockPlanDetail, mockPlanSummaries, mockRecommendationResponse } from '@/test/mocks/handlers'
import { server } from '@/test/mocks/server'
import {
  useCreatePlanMutation,
  usePlanDraft,
  usePlanQuery,
  usePlansQuery,
  useRecommendationsQuery,
  useSavePlanEditMutation,
  useSearchPlanPlacesQuery,
} from './hooks'
import { NEW_PLAN_ID, planDraftStore } from './planDraftStore'
import type { PlanCreateRequest, PlanPlaceSearchPage, TravelPlan } from './types'

function makeLocalPlan(overrides: Partial<TravelPlan> = {}): TravelPlan {
  return {
    id: 'draft',
    title: '로컬 초안',
    destination: '제주도',
    status: 'draft',
    startDate: '2026.10.01',
    endDate: '2026.10.02',
    companionType: 'solo',
    travelerCount: 1,
    interests: [],
    createdAt: new Date().toISOString(),
    waypointPlaceIds: [],
    itinerary: {},
    budgetTransportation: null,
    budgetAccommodation: null,
    budgetFood: null,
    budgetEtc: null,
    ...overrides,
  }
}

const CREATE_PAYLOAD: PlanCreateRequest = {
  title: '새 계획',
  startDate: '2026-10-01',
  endDate: '2026-10-02',
  companion: 'SOLO',
  categories: null,
  departurePlaceId: null,
  departureLocationName: '제주국제공항',
  departureLatitude: 33.5072,
  departureLongitude: 126.4929,
  days: null,
  budget: null,
}

describe('usePlansQuery', () => {
  it('fetches the plan list and carries waypointCount through', async () => {
    function PlansList() {
      const { data, isLoading } = usePlansQuery()
      if (isLoading) return <p>loading</p>
      return (
        <ul>
          {data?.map((plan) => (
            <li key={plan.id}>
              {plan.title} - {plan.waypointCount}곳
            </li>
          ))}
        </ul>
      )
    }

    renderWithProviders(<PlansList />)

    await waitFor(() => {
      expect(screen.getByText(`${mockPlanSummaries[0].title} - ${mockPlanSummaries[0].waypointCount}곳`)).toBeInTheDocument()
    })
    expect(
      screen.getByText(`${mockPlanSummaries[1].title} - ${mockPlanSummaries[1].waypointCount}곳`),
    ).toBeInTheDocument()
  })
})

describe('usePlanQuery', () => {
  function PlanDetail({ planId }: { planId: string }) {
    const { data, isError } = usePlanQuery(planId)
    if (isError) return <p>error</p>
    if (!data) return <p>loading</p>
    return (
      <p>
        {data.title} / {data.itinerary[1]?.waypoints[0]?.title}
      </p>
    )
  }

  it('fetches an existing plan and maps its itinerary', async () => {
    renderWithProviders(<PlanDetail planId={String(mockPlanDetail.planId)} />)

    await waitFor(() => {
      expect(screen.getByText(`${mockPlanDetail.title} / 협재해수욕장`)).toBeInTheDocument()
    })
  })

  it('errors when the plan does not exist (404)', async () => {
    renderWithProviders(<PlanDetail planId="999" />)

    await waitFor(() => {
      expect(screen.getByText('error')).toBeInTheDocument()
    })
  })
})

describe('useCreatePlanMutation / useSavePlanEditMutation', () => {
  it('creates a plan via POST /plans', async () => {
    function CreateButton() {
      const mutation = useCreatePlanMutation()
      return (
        <div>
          <button onClick={() => mutation.mutate(CREATE_PAYLOAD)}>저장</button>
          {mutation.isSuccess ? <p>created:{mutation.data.title}</p> : null}
        </div>
      )
    }

    const user = userEvent.setup()
    renderWithProviders(<CreateButton />)

    await user.click(screen.getByRole('button', { name: '저장' }))

    await waitFor(() => {
      expect(screen.getByText(`created:${CREATE_PAYLOAD.title}`)).toBeInTheDocument()
    })
  })

  it('saves an edit via PUT /plans/:planId', async () => {
    function SaveEditButton() {
      const mutation = useSavePlanEditMutation()
      return (
        <div>
          <button onClick={() => mutation.mutate({ planId: '1', payload: { ...CREATE_PAYLOAD, title: '수정됨' } })}>
            저장
          </button>
          {mutation.isSuccess ? <p>saved:{mutation.data.planId}:{mutation.data.title}</p> : null}
        </div>
      )
    }

    const user = userEvent.setup()
    renderWithProviders(<SaveEditButton />)

    await user.click(screen.getByRole('button', { name: '저장' }))

    await waitFor(() => {
      expect(screen.getByText('saved:1:수정됨')).toBeInTheDocument()
    })
  })
})

describe('useRecommendationsQuery', () => {
  it('fetches recommendations', async () => {
    function Recommendations() {
      const { data, isLoading } = useRecommendationsQuery(
        { departureCoord: null, preferredWaypoints: [], excludedPlaceIds: [], excludeContentIds: [], category: null },
        true,
      )
      if (isLoading) return <p>loading</p>
      return (
        <ul>
          {data?.items.map((item) => (
            <li key={item.placeId}>{item.name}</li>
          ))}
        </ul>
      )
    }

    renderWithProviders(<Recommendations />)

    await waitFor(() => {
      expect(screen.getByText(mockRecommendationResponse.items[0].name)).toBeInTheDocument()
    })
  })
})

describe('useSearchPlanPlacesQuery', () => {
  // v2 검색은 v1(`features/places`)과 같은 `/places` 경로를 쓰는데 모양이 달라서, 공용
  // 핸들러(handlers.ts)는 안 건드리고 이 테스트에서만 v2 응답 모양으로 오버라이드한다.
  it('fetches place search results (v2 shape)', async () => {
    const page: PlanPlaceSearchPage = {
      content: [
        {
          id: 96,
          name: '협재해수욕장',
          address: '제주시 한림읍',
          imageUrl: null,
          categoryName: '자연',
          latitude: 33.394,
          longitude: 126.239,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 20,
    }
    server.use(
      http.get('*/places', () =>
        HttpResponse.json({ isSuccess: true, code: 'FOUND200', message: 'OK', result: page }),
      ),
    )

    function SearchResults() {
      const { data, isLoading } = useSearchPlanPlacesQuery({ keyword: '협재' }, true)
      if (isLoading) return <p>loading</p>
      return (
        <ul>
          {data?.content.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )
    }

    renderWithProviders(<SearchResults />)

    await waitFor(() => {
      expect(screen.getByText('협재해수욕장')).toBeInTheDocument()
    })
  })
})

describe('usePlanDraft', () => {
  afterEach(() => {
    planDraftStore.getState().clearDraft()
  })

  function DraftView({ planId }: { planId: string }) {
    const { plan, isPending, isError } = usePlanDraft(planId)
    if (isPending) return <p>loading</p>
    if (isError) return <p>error</p>
    return <p>{plan?.title}</p>
  }

  it('uses the local draft directly when it matches the planId (no network call)', async () => {
    planDraftStore.getState().setDraft(makeLocalPlan({ id: NEW_PLAN_ID, title: '로컬 초안' }))

    renderWithProviders(<DraftView planId={NEW_PLAN_ID} />)

    expect(await screen.findByText('로컬 초안')).toBeInTheDocument()
  })

  it('falls back to GET /plans/:id and fills the store when there is no matching draft', async () => {
    renderWithProviders(<DraftView planId={String(mockPlanDetail.planId)} />)

    await waitFor(() => {
      expect(screen.getByText(mockPlanDetail.title)).toBeInTheDocument()
    })
    expect(planDraftStore.getState().draft?.id).toBe(String(mockPlanDetail.planId))
  })

  it('errors immediately for a new plan with no draft in the store (no wizard run yet)', async () => {
    renderWithProviders(<DraftView planId={NEW_PLAN_ID} />)

    expect(await screen.findByText('error')).toBeInTheDocument()
  })
})
