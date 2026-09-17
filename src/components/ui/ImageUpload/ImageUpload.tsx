import { useId, useState, type ChangeEvent } from 'react'
import { ImagePlus, PlusCircle } from 'lucide-react'
import { toast } from '@/components/ui/Toast/Toast'
import {
  IMAGE_FILE_ACCEPT,
  IMAGE_FILE_ACCEPT_HINT,
  partitionImageFiles,
} from '@/utils/imageFile'
import {
  hiddenInput,
  iconStyle,
  imageUploadButton,
  previewImage,
  previewName,
} from './ImageUpload.css.ts'
import { cn } from '@/utils/cn'

export type ImageUploadProps = {
  /** 미선택 시 안내 문구. 기본값 "사진을 추가해주세요" */
  label?: string
  /** 허용 MIME/확장자. 기본값은 JPG·PNG·WEBP·HEIC */
  accept?: string
  /** true면 여러 장 선택. 기본값 false */
  multiple?: boolean
  /** 선택된 파일 목록 콜백 */
  onChange?: (files: File[]) => void
  className?: string
}

/**
 * 이미지 파일 선택·미리보기 업로드 버튼.
 *
 * @example
 * <ImageUpload multiple onChange={setFiles} />
 */
export function ImageUpload({
  label = '사진을 추가해주세요',
  accept = IMAGE_FILE_ACCEPT,
  multiple = false,
  onChange,
  className,
}: ImageUploadProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files ? Array.from(event.target.files) : []
    const { accepted, rejected } = partitionImageFiles(nextFiles)
    if (rejected.length > 0) {
      toast.error(`${IMAGE_FILE_ACCEPT_HINT} 형식의 이미지만 첨부할 수 있어요`)
    }

    setFiles(accepted)
    onChange?.(accepted)

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      const firstImage = accepted[0]
      return firstImage ? URL.createObjectURL(firstImage) : null
    })
    event.target.value = ''
  }

  return (
    <label htmlFor={inputId} className={cn(imageUploadButton, className)}>
      <input
        id={inputId}
        type="file"
        className={hiddenInput}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      {previewUrl ? (
        <>
          <img className={previewImage} src={previewUrl} alt="" />
          <span className={previewName}>
            {files.length > 1 ? `${files[0]?.name} 외 ${files.length - 1}개` : files[0]?.name}
          </span>
        </>
      ) : (
        <>
          <span className={iconStyle}>
            {multiple ? <ImagePlus size={24} aria-hidden /> : <PlusCircle size={24} aria-hidden />}
          </span>
          {label}
        </>
      )}
    </label>
  )
}
