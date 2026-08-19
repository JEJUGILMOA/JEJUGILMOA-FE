import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { useMyRecordsQuery, useUpdateRecordMutation } from '@/features/records/hooks'
import type { PlaceMemo, RecordVisibility, SavedRecord } from '@/features/records/types'
import { PhotoGrid } from '@/pages/record/create/components/PhotoGrid'
import { PlaceMemoSheet } from '@/pages/record/create/components/PlaceMemoSheet'
import { SelectableOption } from '@/pages/record/create/components/SelectableOption'
import { EditPlaceMemoRow } from './components/EditPlaceMemoRow'
import {
  divider,
  fieldGroupStyle,
  optionListStyle,
  pageStyle,
  placeMemoListStyle,
  sectionCountStyle,
  sectionHeaderStyle,
  sectionLabelStyle,
  sectionStyle,
} from './RecordEditPage.css.ts'

const EMPTY_MEMO: PlaceMemo = { note: '', photos: [] }

/** STEP 10: 기록 수정 — 기록 상세 케밥 관리 메뉴의 '기록 수정' 클릭 시 진입 */
export function RecordEditPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()
  const myRecordsQuery = useMyRecordsQuery()

  const record = myRecordsQuery.data?.find((item) => item.id === recordId) ?? null

  const goBack = () => navigate(recordId ? ROUTES.recordDetail(recordId) : ROUTES.record)

  if (myRecordsQuery.isLoading) {
    return (
      <div>
        <PageHeader title="기록 수정" showBack onBack={goBack} />
        <Loading label="기록을 불러오는 중…" />
      </div>
    )
  }

  if (!record) {
    return (
      <div>
        <PageHeader title="기록 수정" showBack onBack={goBack} />
        <Empty title="기록을 찾을 수 없어요" description="삭제되었거나 존재하지 않는 기록이에요." />
      </div>
    )
  }

  return <RecordEditForm key={record.id} record={record} />
}

/** record가 로드된 후에만 마운트되어 폼 상태를 안전하게 초기값으로 세팅한다 */
function RecordEditForm({ record }: { record: SavedRecord }) {
  const navigate = useNavigate()
  const updateMutation = useUpdateRecordMutation()

  const [title, setTitle] = useState(record.title)
  const [summary, setSummary] = useState(record.summary)
  const [placeMemos, setPlaceMemos] = useState<Record<string, PlaceMemo>>(() =>
    Object.fromEntries(
      record.visitedPlaces.map((place) => [
        place.placeId,
        { note: place.note, photos: place.photoUrls } satisfies PlaceMemo,
      ]),
    ),
  )
  const [photos, setPhotos] = useState<(File | string)[]>(record.photoUrls)
  const [visibility, setVisibility] = useState<RecordVisibility>(record.visibility)
  const [isDirty, setIsDirty] = useState(false)
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // 닫힘 애니메이션 중 시트 내용이 먼저 사라지지 않도록 마지막으로 연 장소를 유지 (DetailsStep과 동일한 기법)
  const activePlace = record.visitedPlaces.find((place) => place.placeId === activePlaceId) ?? null
  const [renderedPlace, setRenderedPlace] = useState(activePlace)
  if (activePlace && activePlace !== renderedPlace) {
    setRenderedPlace(activePlace)
  }

  const goToDetail = () => navigate(ROUTES.recordDetail(record.id))

  const handleBack = () => {
    if (isDirty) {
      setShowLeaveConfirm(true)
      return
    }
    goToDetail()
  }

  const handleSave = () => {
    const toUrl = (photo: File | string) =>
      typeof photo === 'string' ? photo : URL.createObjectURL(photo)

    const visitedPlaces = record.visitedPlaces.map((place) => {
      const memo = placeMemos[place.placeId]
      return {
        placeId: place.placeId,
        placeName: place.placeName,
        note: memo?.note ?? place.note,
        photoUrls: (memo?.photos ?? place.photoUrls).map(toUrl),
      }
    })
    const photoUrls = photos.map(toUrl)

    updateMutation.mutate(
      {
        id: record.id,
        patch: {
          title,
          summary,
          visibility,
          visitedPlaces,
          photoUrls,
          photoCount: photoUrls.length,
        },
      },
      {
        onSuccess: () => {
          toast.success('기록을 수정했어요')
          goToDetail()
        },
      },
    )
  }

  return (
    <div>
      <PageHeader title="기록 수정" showBack onBack={handleBack} />

      <div className={pageStyle}>
        <div className={fieldGroupStyle}>
          <TextField
            label="기록 제목"
            value={title}
            onChange={(value) => {
              setTitle(value)
              setIsDirty(true)
            }}
            maxLength={30}
            showCount
          />
          <TextField
            label="한줄 소개"
            value={summary}
            onChange={(value) => {
              setSummary(value)
              setIsDirty(true)
            }}
            maxLength={50}
            showCount
          />
        </div>

        <div className={sectionStyle}>
          <div className={sectionHeaderStyle}>
            <span className={sectionLabelStyle}>방문 장소별 메모</span>
            <span className={sectionCountStyle}>{record.visitedPlaces.length}곳</span>
          </div>
          <div className={placeMemoListStyle}>
            {record.visitedPlaces.map((place) => {
              const memo = placeMemos[place.placeId]
              const thumbnail = memo?.photos[0]
              return (
                <EditPlaceMemoRow
                  key={place.placeId}
                  placeName={place.placeName}
                  note={memo?.note ?? ''}
                  thumbnailUrl={typeof thumbnail === 'string' ? thumbnail : null}
                  onEdit={() => setActivePlaceId(place.placeId)}
                />
              )
            })}
          </div>
        </div>

        <div className={divider} />

        <div className={sectionStyle}>
          <div className={sectionHeaderStyle}>
            <span className={sectionLabelStyle}>사진</span>
            <span className={sectionCountStyle}>{photos.length}장</span>
          </div>
          <PhotoGrid
            photos={photos}
            onAdd={(files) => {
              setPhotos((prev) => [...prev, ...files])
              setIsDirty(true)
            }}
            onRemove={(index) => {
              setPhotos((prev) => prev.filter((_, i) => i !== index))
              setIsDirty(true)
            }}
          />
        </div>

        <div className={divider} />

        <div className={sectionStyle}>
          <span className={sectionLabelStyle}>공개 범위</span>
          <div className={optionListStyle}>
            <SelectableOption
              title="전체 공개"
              description="모든 사용자에게 노출됩니다"
              selected={visibility === 'public'}
              onSelect={() => {
                setVisibility('public')
                setIsDirty(true)
              }}
            />
            <SelectableOption
              title="비공개"
              description="나만 볼 수 있습니다"
              selected={visibility === 'private'}
              onSelect={() => {
                setVisibility('private')
                setIsDirty(true)
              }}
            />
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleSave} isLoading={updateMutation.isPending}>
          저장하기
        </Button>
      </div>

      <BottomSheet
        open={activePlaceId !== null}
        onOpenChange={(open) => {
          if (!open) setActivePlaceId(null)
        }}
        minHeight={0.75}
        initialHeight={0.75}
        maxHeight={0.75}
      >
        {renderedPlace ? (
          <PlaceMemoSheet
            key={renderedPlace.placeId}
            placeName={renderedPlace.placeName}
            initialMemo={placeMemos[renderedPlace.placeId] ?? EMPTY_MEMO}
            onSave={(memo) => {
              setPlaceMemos((prev) => ({ ...prev, [renderedPlace.placeId]: memo }))
              setIsDirty(true)
              setActivePlaceId(null)
            }}
          />
        ) : null}
      </BottomSheet>

      <Modal
        open={showLeaveConfirm}
        title="변경사항을 취소할까요?"
        description="저장하지 않은 변경사항은 사라져요."
        onClose={() => setShowLeaveConfirm(false)}
        actions={[
          { label: '계속 수정', variant: 'ghost', onClick: () => setShowLeaveConfirm(false) },
          { label: '나가기', variant: 'danger', onClick: goToDetail },
        ]}
      />
    </div>
  )
}
