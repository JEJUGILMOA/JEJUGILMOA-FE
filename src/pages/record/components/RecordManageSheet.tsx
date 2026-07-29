import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Modal } from '@/components/ui/Modal/Modal'
import { Popover } from '@/components/ui/Popover/Popover'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { SelectableOption } from '@/pages/record/create/components/SelectableOption'
import { useDeleteRecordMutation, useUpdateRecordMutation } from '@/features/records/hooks'
import type { RecordVisibility, SavedRecord } from '@/features/records/types'
import {
  manageButtonStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  optionListStyle,
  triggerWrapStyle,
} from './RecordManageSheet.css.ts'

type ModalView = 'visibility' | 'delete' | null

export type RecordManageSheetProps = {
  record: SavedRecord
  /** true면 카드 썸네일 위 오버레이가 아니라 부모 flex 흐름에 맞춰 인라인으로 렌더링 (상세 페이지 헤더용) */
  inline?: boolean
  /** 삭제 완료 후 호출. 상세 페이지처럼 삭제된 기록을 더 이상 보여줄 수 없는 화면에서 사용 */
  onDeleted?: () => void
}

/** STEP 07: 내 기록 관리 (케밥 팝오버 메뉴 → 수정 · 공개 범위 설정 · 삭제) */
export function RecordManageSheet({ record, inline = false, onDeleted }: RecordManageSheetProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalView, setModalView] = useState<ModalView>(null)

  const updateMutation = useUpdateRecordMutation()
  const deleteMutation = useDeleteRecordMutation()

  const openModal = (view: Exclude<ModalView, null>) => {
    setMenuOpen(false)
    setModalView(view)
  }

  const closeModal = () => setModalView(null)

  const handleEdit = () => {
    setMenuOpen(false)
    navigate(ROUTES.recordEdit(record.id))
  }

  const handleSetVisibility = (visibility: RecordVisibility) => {
    updateMutation.mutate(
      { id: record.id, patch: { visibility } },
      {
        onSuccess: () => {
          toast.success('공개 범위를 변경했어요')
          closeModal()
        },
      },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(record.id, {
      onSuccess: () => {
        toast.success('기록을 삭제했어요')
        closeModal()
        onDeleted?.()
      },
    })
  }

  const popover = (
    <Popover
      open={menuOpen}
      onOpenChange={setMenuOpen}
      align="end"
      ariaLabel="기록 관리 메뉴"
      trigger={
        <button
          type="button"
          className={manageButtonStyle}
          aria-label="기록 관리"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <MoreVertical size={16} aria-hidden />
        </button>
      }
    >
      <div className={menuListStyle}>
        <button type="button" role="menuitem" className={menuItemStyle} onClick={handleEdit}>
          기록 수정
        </button>
        <button
          type="button"
          role="menuitem"
          className={menuItemStyle}
          onClick={() => openModal('visibility')}
        >
          공개 범위 설정
        </button>
        <button
          type="button"
          role="menuitem"
          className={menuItemDangerStyle}
          onClick={() => openModal('delete')}
        >
          기록 삭제
        </button>
      </div>
    </Popover>
  )

  return (
    <>
      {inline ? (
        popover
      ) : (
        <div className={triggerWrapStyle} onClick={(event) => event.stopPropagation()}>
          {popover}
        </div>
      )}

      <Modal
        open={modalView === 'visibility'}
        title="공개 범위 설정"
        onClose={closeModal}
        actions={[]}
      >
        <div className={optionListStyle}>
          <SelectableOption
            title="전체 공개"
            description="모든 사용자에게 노출됩니다"
            selected={record.visibility === 'public'}
            onSelect={() => handleSetVisibility('public')}
          />
          <SelectableOption
            title="비공개"
            description="나만 볼 수 있습니다"
            selected={record.visibility === 'private'}
            onSelect={() => handleSetVisibility('private')}
          />
        </div>
      </Modal>

      <Modal
        open={modalView === 'delete'}
        title="기록을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        onClose={closeModal}
        actions={[
          { label: '취소', variant: 'ghost', onClick: closeModal },
          { label: '삭제', variant: 'danger', onClick: handleDelete },
        ]}
      />
    </>
  )
}
