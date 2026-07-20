import { useId, useState, type ChangeEvent } from 'react'
import { ImagePlus, PlusCircle } from 'lucide-react'
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
  /** 허용 MIME. 기본값 image/* */
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
  accept = 'image/*',
  multiple = false,
  onChange,
  className,
}: ImageUploadProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files ? Array.from(event.target.files) : []
    setFiles(nextFiles)
    onChange?.(nextFiles)

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      const firstImage = nextFiles.find((file) => file.type.startsWith('image/'))
      return firstImage ? URL.createObjectURL(firstImage) : null
    })
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
