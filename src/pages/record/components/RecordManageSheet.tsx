import { useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { Modal } from '@/components/ui/Modal/Modal'
import { TextField } from '@/components/ui/TextField/TextField'
import { toast } from '@/components/ui/Toast/Toast'
import { SelectableOption } from '@/pages/record/create/components/SelectableOption'
import { useDeleteRecordMutation, useUpdateRecordMutation } from '@/features/records/hooks'
import type { RecordVisibility, SavedRecord } from '@/features/records/types'
import {
  fieldGroupStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  optionListStyle,
} from './RecordManageSheet.css.ts'

type ManageView = 'menu' | 'edit' | 'visibility'

export type RecordManageSheetProps = {
  record: SavedRecord
  /** 바텀시트 열림 여부. 열릴 때마다 메뉴 화면으로 초기화된다. */
  open: boolean
  onClose: () => void
}

/** STEP 07: 내 기록 관리 (수정 · 공개 범위 설정 · 삭제) */
export function RecordManageSheet({ record, open, onClose }: RecordManageSheetProps) {
  const [view, setView] = useState<ManageView>('menu')
  const [title, setTitle] = useState(record.title)
  const [summary, setSummary] = useState(record.summary)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  // 시트가 새로 열릴 때마다 메뉴 화면·입력값을 초기화
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setView('menu')
      setTitle(record.title)
      setSummary(record.summary)
    }
  }

  const updateMutation = useUpdateRecordMutation()
  const deleteMutation = useDeleteRecordMutation()

  const handleSaveEdit = () => {
    updateMutation.mutate(
      { id: record.id, patch: { title, summary } },
      {
        onSuccess: () => {
          toast.success('기록을 수정했어요')
          onClose()
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
          onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(record.id, {
      onSuccess: () => {
        toast.success('기록을 삭제했어요')
        setConfirmDeleteOpen(false)
        onClose()
      },
    })
  }

  return (
    <>
      {view === 'menu' ? (
        <div className={menuListStyle}>
          <button type="button" className={menuItemStyle} onClick={() => setView('edit')}>
            기록 수정
          </button>
          <button type="button" className={menuItemStyle} onClick={() => setView('visibility')}>
            공개 범위 설정
          </button>
          <button
            type="button"
            className={menuItemDangerStyle}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            기록 삭제
          </button>
        </div>
      ) : null}

      {view === 'edit' ? (
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
      ) : null}

      {view === 'visibility' ? (
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
      ) : null}

      <Modal
        open={confirmDeleteOpen}
        title="기록을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        onClose={() => setConfirmDeleteOpen(false)}
        actions={[
          { label: '취소', variant: 'ghost', onClick: () => setConfirmDeleteOpen(false) },
          { label: '삭제', variant: 'danger', onClick: handleDelete },
        ]}
      />
    </>
  )
}
