import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { TextField } from '@/components/ui/TextField/TextField'
import { TextArea } from '@/components/ui/TextArea/TextArea'
import { Button } from '@/components/ui/Button/Button'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { fieldGroupStyle, pageStyle } from './SupportInquiryPage.css.ts'

export function SupportInquiryPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 입력해 주세요.')
      return
    }
    toast.success('문의가 등록되었어요.')
    navigate(ROUTES.mySupport)
  }

  return (
    <div className={pageStyle}>
      <PageHeader title="문의하기" showBack onBack={() => navigate(ROUTES.mySupport)} />

      <div className={fieldGroupStyle}>
        <TextField label="제목" value={title} onChange={setTitle} placeholder="문의 제목" />
        <TextArea
          value={content}
          onChange={setContent}
          placeholder="문의 내용을 입력해 주세요."
          maxLength={500}
        />
        <Button fullWidth onClick={handleSubmit}>
          등록하기
        </Button>
      </div>
    </div>
  )
}
