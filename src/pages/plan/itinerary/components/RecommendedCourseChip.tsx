import { chipStyle, metaStyle, titleStyle } from './RecommendedCourseChip.css.ts'

export type RecommendedCourseChipProps = {
  title: string
  meta: string
  onClick: () => void
}

/** STEP 02 상단 "추천 코스로 한 번에 담기" 가로 스크롤 항목 */
export function RecommendedCourseChip({ title, meta, onClick }: RecommendedCourseChipProps) {
  return (
    <button type="button" className={chipStyle} onClick={onClick}>
      <span className={titleStyle}>{title}</span>
      <span className={metaStyle}>{meta}</span>
    </button>
  )
}
