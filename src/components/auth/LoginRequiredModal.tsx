import { useNavigate } from 'react-router'
import { Modal } from '@/components/ui/Modal/Modal'
import { openLogin } from '@/features/auth/openLogin'
import { useLoginPromptStore } from '@/stores/loginPromptStore'

/** 전역 로그인 유도 모달 — AppLayout에 한 번만 마운트 */
export function LoginRequiredModal() {
  const navigate = useNavigate()
  const open = useLoginPromptStore((s) => s.open)
  const title = useLoginPromptStore((s) => s.title)
  const description = useLoginPromptStore((s) => s.description)
  const returnTo = useLoginPromptStore((s) => s.returnTo)
  const closePrompt = useLoginPromptStore((s) => s.closePrompt)

  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={closePrompt}
      actions={[
        {
          label: '닫기',
          onClick: closePrompt,
          variant: 'ghost',
        },
        {
          label: '로그인하기',
          onClick: () => {
            closePrompt()
            openLogin(navigate, { returnTo })
          },
        },
      ]}
    />
  )
}
