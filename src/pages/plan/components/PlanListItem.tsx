import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import { MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import { Modal } from '@/components/ui/Modal/Modal'
import { Popover } from '@/components/ui/Popover/Popover'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { useDeletePlanMutation } from '@/features/plans/hooks'
import type { PlanGroup } from '@/features/plans/planStatus'
import type { TravelPlan } from '@/features/plans/types'
import {
  clickableCardStyle,
  dateRangeStyle,
  manageButtonStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  metaStyle,
  titleRowStyle,
  titleTextStyle,
  triggerWrapStyle,
} from './PlanListItem.css.ts'

const COMPANION_LABELS: Record<TravelPlan['companionType'], string> = {
  solo: '혼자',
  couple: '연인과',
  family: '가족과',
  friends: '친구와',
  colleague: '동료와',
}

export type PlanListItemProps = {
  plan: TravelPlan
  /** 진행중인 계획은 관리 메뉴(⋯)를 아예 렌더링하지 않아 삭제할 수 없다. */
  group: PlanGroup
}

/** `/plan` 목록의 계획 카드 1개 항목. 클릭하면 계획 미리보기(수정 가능)로 이동한다. */
export function PlanListItem({ plan, group }: PlanListItemProps) {
  const navigate = useNavigate()
  const deletePlanMutation = useDeletePlanMutation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const goToPreview = () => navigate(ROUTES.planPreview(plan.id))

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToPreview()
    }
  }

  const handleEditItinerary = () => {
    setMenuOpen(false)
    navigate(ROUTES.planItinerary(plan.id))
  }

  const openDeleteConfirm = () => {
    setMenuOpen(false)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    deletePlanMutation.mutate(plan.id, {
      onSuccess: () => {
        toast.success('계획을 삭제했어요')
        setConfirmOpen(false)
      },
      onError: () => {
        toast.error('계획 삭제에 실패했어요. 다시 시도해 주세요.')
      },
    })
  }

  return (
    <Card
      className={clickableCardStyle}
      role="button"
      tabIndex={0}
      onClick={goToPreview}
      onKeyDown={handleKeyDown}
    >
      <div className={titleRowStyle}>
        <h3 className={titleTextStyle}>{plan.title}</h3>
        {group === 'ongoing' ? <Badge status="info">진행중</Badge> : null}
        {group === 'draft' ? <Badge status="neutral">임시저장</Badge> : null}
      </div>

      <p className={dateRangeStyle}>
        {plan.startDate} - {plan.endDate}
      </p>
      <p className={metaStyle}>
        {plan.transportMode}로 출발 · {COMPANION_LABELS[plan.companionType]}
        {plan.companionType !== 'solo' ? ` · ${plan.travelerCount}명` : ''}
      </p>

      {group !== 'ongoing' ? (
        <div
          className={triggerWrapStyle}
          onClick={(event: MouseEvent) => event.stopPropagation()}
        >
          <Popover
            open={menuOpen}
            onOpenChange={setMenuOpen}
            align="end"
            ariaLabel="계획 관리 메뉴"
            trigger={
              <button
                type="button"
                className={manageButtonStyle}
                aria-label="계획 관리"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <MoreVertical size={16} aria-hidden />
              </button>
            }
          >
            <div className={menuListStyle}>
              <button
                type="button"
                role="menuitem"
                className={menuItemStyle}
                onClick={handleEditItinerary}
              >
                일정 수정
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItemDangerStyle}
                onClick={openDeleteConfirm}
              >
                계획 삭제
              </button>
            </div>
          </Popover>
        </div>
      ) : null}

      <Modal
        open={confirmOpen}
        title="계획을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        onClose={() => setConfirmOpen(false)}
        actions={[
          { label: '취소', variant: 'ghost', onClick: () => setConfirmOpen(false) },
          { label: '삭제', variant: 'danger', onClick: handleDelete },
        ]}
      />
    </Card>
  )
}
