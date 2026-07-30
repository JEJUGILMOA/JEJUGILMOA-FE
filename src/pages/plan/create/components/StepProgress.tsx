import { segmentRecipe, trackStyle } from './StepProgress.css.ts'

export type StepProgressProps = {
  /** 전체 세그먼트 수 */
  total: number
  /** 현재 활성 인덱스 (0-based). 이 값 이하 세그먼트가 채워진다 */
  activeIndex: number
}

/** STEP 01 마법사 상단 진행바 */
export function StepProgress({ total, activeIndex }: StepProgressProps) {
  return (
    <div className={trackStyle} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={activeIndex + 1}>
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className={segmentRecipe({ active: index <= activeIndex })} />
      ))}
    </div>
  )
}
