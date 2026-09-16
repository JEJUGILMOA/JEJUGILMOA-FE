import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal/Modal'
import { Popover } from '@/components/ui/Popover/Popover'
import { TextArea } from '@/components/ui/TextArea/TextArea'
import { toast } from '@/components/ui/Toast/Toast'
import { useReportRecordMutation } from '@/features/records/hooks'
import {
  dropdownMenuItemStyle,
  dropdownMenuListStyle,
  dropdownPanelStyle,
  dropdownRootStyle,
  dropdownTriggerStyle,
  fieldGroupStyle,
  fieldLabelStyle,
  formStyle,
} from './ReportRecordModal.css.ts'

const REPORT_REASONS = [
  { id: 'hate', label: '욕설·혐오 발언', summary: '욕설 및 혐오 발언이 포함되어 있습니다.' },
  { id: 'spam', label: '스팸·광고', summary: '스팸 또는 광고성 내용입니다.' },
  { id: 'inappropriate', label: '부적절한 내용', summary: '부적절한 사진 또는 내용이 포함되어 있습니다.' },
  { id: 'privacy', label: '개인정보 노출', summary: '개인정보가 노출되어 있습니다.' },
  { id: 'other', label: '기타', summary: '' },
] as const

type ReasonId = (typeof REPORT_REASONS)[number]['id']

export type ReportRecordModalProps = {
  open: boolean
  recordId: string
  onClose: () => void
}

/** 여행 기록 신고 모달 — 사유 드롭다운 + 선택적 상세 입력 후 POST /records/{id}/reports */
export function ReportRecordModal({ open, recordId, onClose }: ReportRecordModalProps) {
  const [reasonId, setReasonId] = useState<ReasonId | null>(null)
  const [reasonOpen, setReasonOpen] = useState(false)
  const [otherSummary, setOtherSummary] = useState('')
  const [reasonDetail, setReasonDetail] = useState('')
  const reportMutation = useReportRecordMutation()

  useEffect(() => {
    if (!open) return
    setReasonId(null)
    setReasonOpen(false)
    setOtherSummary('')
    setReasonDetail('')
  }, [open])

  const selected = REPORT_REASONS.find((item) => item.id === reasonId) ?? null
  const reasonSummary =
    selected?.id === 'other' ? otherSummary.trim() : (selected?.summary.trim() ?? '')

  const handleSubmit = () => {
    if (!reasonId) {
      toast.error('신고 사유를 선택해 주세요.')
      return
    }
    if (!reasonSummary) {
      toast.error('기타 사유를 입력해 주세요.')
      return
    }
    if (reportMutation.isPending) return

    reportMutation.mutate(
      {
        recordId,
        reasonSummary,
        reasonDetail: reasonDetail.trim() || undefined,
      },
      { onSuccess: () => onClose() },
    )
  }

  return (
    <Modal
      open={open}
      forceWeb
      title="기록 신고하기"
      description="신고 사유를 선택해 주세요. 검토 후 조치할게요."
      onClose={onClose}
      actions={[
        {
          label: '취소',
          variant: 'ghost',
          grow: false,
          onClick: onClose,
        },
        {
          label: reportMutation.isPending ? '접수 중…' : '신고하기',
          variant: 'danger',
          onClick: handleSubmit,
        },
      ]}
    >
      <div className={formStyle}>
        <div className={fieldGroupStyle}>
          <span className={fieldLabelStyle}>신고 사유</span>
          <div className={dropdownRootStyle}>
            <Popover
              open={reasonOpen}
              onOpenChange={setReasonOpen}
              align="start"
              ariaLabel="신고 사유"
              panelClassName={dropdownPanelStyle}
              trigger={
                <button
                  type="button"
                  className={dropdownTriggerStyle({
                    open: reasonOpen,
                    placeholder: !selected,
                  })}
                  aria-haspopup="listbox"
                  aria-expanded={reasonOpen}
                  onClick={() => setReasonOpen((prev) => !prev)}
                >
                  <span>{selected?.label ?? '사유를 선택해 주세요'}</span>
                  <ChevronDown size={16} aria-hidden />
                </button>
              }
            >
              <div className={dropdownMenuListStyle} role="listbox">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    role="option"
                    aria-selected={reasonId === reason.id}
                    className={dropdownMenuItemStyle({ selected: reasonId === reason.id })}
                    onClick={() => {
                      setReasonId(reason.id)
                      setReasonOpen(false)
                    }}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </Popover>
          </div>
        </div>

        {reasonId === 'other' ? (
          <div className={fieldGroupStyle}>
            <span className={fieldLabelStyle}>기타 사유</span>
            <TextArea
              value={otherSummary}
              onChange={setOtherSummary}
              maxLength={200}
              placeholder="신고 사유를 입력해 주세요"
            />
          </div>
        ) : null}

        <div className={fieldGroupStyle}>
          <span className={fieldLabelStyle}>상세 내용 (선택)</span>
          <TextArea
            value={reasonDetail}
            onChange={setReasonDetail}
            maxLength={500}
            placeholder="추가로 전달할 내용이 있다면 적어 주세요"
          />
        </div>
      </div>
    </Modal>
  )
}
