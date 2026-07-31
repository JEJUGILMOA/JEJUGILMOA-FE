import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanWaypointsMutation } from '@/features/plans/hooks'
import {
  collectedNoticeStyle,
  descriptionStyle,
  detailCardStyle,
  detailCategoryStyle,
  detailTitleStyle,
  doneLinkStyle,
  legendDotStyle,
  legendItemStyle,
  legendRowStyle,
  nearestInfoStyle,
  pageStyle,
} from './PlanMapAddPage.css.ts'
import { PlaceholderMap } from './components/PlaceholderMap'

const TRAVEL_LABELS = ['도보 5분', '도보 8분', '도보 12분', '차량 8분', '차량 15분', '차량 25분']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

/** 저장된 장소 중 candidateId와 가장 가까운 곳을 결정론적으로 골라 이동 정보를 붙여 반환 */
function findNearestSavedPlace(candidateId: string, savedPlaceIds: string[]) {
  const others = savedPlaceIds.filter((id) => id !== candidateId)
  if (others.length === 0) return null

  const nearestId = others[hashString(candidateId) % others.length]
  const nearestPlace = MOCK_PLACES.find((place) => place.id === nearestId)
  if (!nearestPlace) return null

  const label = TRAVEL_LABELS[hashString(`${candidateId}:${nearestId}`) % TRAVEL_LABELS.length]
  return { title: nearestPlace.title, label }
}

export function PlanMapAddPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateWaypointsMutation = useUpdatePlanWaypointsMutation()

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)

  const goBack = () => navigate(-1)
  const goDone = () => navigate(ROUTES.plan)

  if (isLoading || !plan) {
    return (
      <div>
        <PageHeader title="지도추가" showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  const isCollected = (placeId: string) => plan.waypointPlaceIds.includes(placeId)
  const firstCandidate = MOCK_PLACES.find((place) => !isCollected(place.id))
  const activeSelectedPlaceId = selectedPlaceId ?? firstCandidate?.id ?? MOCK_PLACES[0]?.id ?? null
  const selectedPlace = activeSelectedPlaceId
    ? MOCK_PLACES.find((place) => place.id === activeSelectedPlaceId)
    : undefined
  const selectedCollected = selectedPlace ? isCollected(selectedPlace.id) : false
  const nearest = selectedPlace ? findNearestSavedPlace(selectedPlace.id, plan.waypointPlaceIds) : null

  const handleCollect = () => {
    if (!selectedPlace) return
    updateWaypointsMutation.mutate(
      { planId, waypointPlaceIds: [...plan.waypointPlaceIds, selectedPlace.id] },
      {
        onSuccess: () => {
          toast.success(`${selectedPlace.title}를 담았어요`)
        },
        onError: () => {
          toast.error('장소 추가에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  return (
    <div>
      <PageHeader
        title="지도추가"
        showBack
        onBack={goBack}
        rightSlot={
          <button type="button" className={doneLinkStyle} onClick={goDone}>
            완료
          </button>
        }
      />

      <div className={pageStyle}>
        <p className={descriptionStyle}>지도에서 더 담고 싶은 장소를 찾아보세요.</p>

        <div className={legendRowStyle}>
          <span className={legendItemStyle}>
            <span className={legendDotStyle({ collected: false })} aria-hidden />
            아직 안 담은 장소
          </span>
          <span className={legendItemStyle}>
            <span className={legendDotStyle({ collected: true })} aria-hidden />
            이미 담은 장소
          </span>
        </div>

        <PlaceholderMap
          pins={MOCK_PLACES.map((place) => ({
            id: place.id,
            label: place.title,
            collected: isCollected(place.id),
          }))}
          selectedId={activeSelectedPlaceId}
          onSelect={setSelectedPlaceId}
        />

        {selectedPlace ? (
          <>
            <div className={detailCardStyle}>
              <span className={detailTitleStyle}>{selectedPlace.title}</span>
              <span className={detailCategoryStyle}>
                {selectedPlace.categoryLabel ?? selectedPlace.category}
              </span>
              {nearest ? (
                <span className={nearestInfoStyle}>
                  가장 가까운 저장 장소: {nearest.title} ({nearest.label})
                </span>
              ) : null}
            </div>

            {selectedCollected ? (
              <p className={collectedNoticeStyle}>이미 담은 장소예요.</p>
            ) : (
              <Button
                fullWidth
                size="lg"
                isLoading={updateWaypointsMutation.isPending}
                onClick={handleCollect}
              >
                담기
              </Button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
