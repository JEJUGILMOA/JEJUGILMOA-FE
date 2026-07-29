import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Modal } from '@/components/ui/Modal/Modal'
import { Popover } from '@/components/ui/Popover/Popover'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { SelectableOption } from '@/pages/record/create/components/SelectableOption'
import { useDeleteRecordMutation, useUpdateRecordMutation } from '@/features/records/hooks'
import type { RecordVisibility, SavedRecord } from '@/features/records/types'
import {
  fieldGroupStyle,
  manageButtonStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  optionListStyle,
  triggerWrapStyle,
} from './RecordManageSheet.css.ts'

type ModalView = 'edit' | 'visibility' | 'delete' | null

export type RecordManageSheetProps = {
  record: SavedRecord
}

/** STEP 07: 내 기록 관리 (케밥 팝오버 메뉴 → 수정 · 공개 범위 설정 · 삭제) */
export function RecordManageSheet({ record }: RecordManageSheetProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalView, setModalView] = useState<ModalView>(null)
  const [title, setTitle] = useState(record.title)
  const [summary, setSummary] = useState(record.summary)

  const updateMutation = useUpdateRecordMutation()
  const deleteMutation = useDeleteRecordMutation()

  const openModal = (view: Exclude<ModalView, null>) => {
    setMenuOpen(false)
    setTitle(record.title)
    setSummary(record.summary)
    setModalView(view)
  }

  const closeModal = () => setModalView(null)

  const handleSaveEdit = () => {
    updateMutation.mutate(
      { id: record.id, patch: { title, summary } },
      {
        onSuccess: () => {
          toast.success('기록을 수정했어요')
          closeModal()
        },
      },
    )
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
      },
    })
  }

  return (
    <>
      <div className={triggerWrapStyle}>
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
            <button
              type="button"
              role="menuitem"
              className={menuItemStyle}
              onClick={() => openModal('edit')}
            >
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
      </div>

      <Modal open={modalView === 'edit'} title="기록 수정" onClose={closeModal} actions={[]}>
        <div className={fieldGroupStyle}>
          <TextField label="기록 제목" value={title} onChange={setTitle} maxLength={30} showCount />
          <TextField
            label="한줄 소개"
            value={summary}
            onChange={setSummary}
            maxLength={50}
            showCount
          />
          <Button fullWidth onClick={handleSaveEdit} isLoading={updateMutation.isPending}>
            저장
          </Button>
        </div>
      </Modal>

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
