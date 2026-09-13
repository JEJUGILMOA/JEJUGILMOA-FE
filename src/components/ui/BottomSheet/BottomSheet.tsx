import { useMemo, useState, type ReactNode } from 'react'
import { Drawer } from 'vaul'
import {
  bodyStyle,
  contentStyle,
  handleStyle,
  overlayStyle,
  srOnlyStyle,
  titleStyle,
  visiblePanelStyle,
} from './BottomSheet.css.ts'

type SnapValue = number | string

type BottomSheetProps = {
  /** true면 시트 표시 */
  open: boolean
  /** 열림/닫힘 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 시트 제목. 없으면 스크린리더용 기본 제목 */
  title?: string
  /** 본문 */
  children: ReactNode
  /** 처음 열릴 때 높이 (화면 비율 0~1 또는 px). 기본값 0.55 */
  initialHeight?: SnapValue
  /** 드래그 시 최소 높이. 기본값 0.4 */
  minHeight?: SnapValue
  /** 드래그 시 최대 높이. 기본값 0.85 */
  maxHeight?: SnapValue
}

const DEFAULT_MIN: SnapValue = 0.4
const DEFAULT_INITIAL: SnapValue = 0.55
const DEFAULT_MAX: SnapValue = 0.85

function snapToNumber(value: SnapValue) {
  return typeof value === 'number' ? value : Number.parseFloat(value)
}

function buildSnapPoints(min: SnapValue, initial: SnapValue, max: SnapValue): SnapValue[] {
  const unique = new Map<string, SnapValue>()
  for (const point of [min, initial, max]) {
    unique.set(String(point), point)
  }
  return [...unique.values()].sort((a, b) => snapToNumber(a) - snapToNumber(b))
}

function toHeightCss(height: SnapValue) {
  if (typeof height === 'number') return `${height * 100}dvh`
  return height
}

/**
 * 하단에서 올라오는 드래그 가능한 바텀시트.
 *
 * @example
 * <BottomSheet open={open} onOpenChange={setOpen} title="필터">내용</BottomSheet>
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  initialHeight = DEFAULT_INITIAL,
  minHeight = DEFAULT_MIN,
  maxHeight = DEFAULT_MAX,
}: BottomSheetProps) {
  const snapPoints = useMemo(
    () => buildSnapPoints(minHeight, initialHeight, maxHeight),
    [minHeight, initialHeight, maxHeight],
  )
  const [activeSnapPoint, setActiveSnapPoint] = useState<SnapValue | null>(initialHeight)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setActiveSnapPoint(initialHeight)
  }

  const sheetHeight = activeSnapPoint ?? initialHeight

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      modal
      dismissible
      // 키보드 열릴 때 visualViewport 재배치로 시트가 내려가거나 닫히는 것 방지
      repositionInputs={false}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className={overlayStyle} />
        <Drawer.Content className={contentStyle}>
          {/*
            vaul은 drawer를 뷰포트 전체 높이로 두고 translateY로 스냅한다.
            실제 UI는 스냅 높이 패널에만 두어 하단 버튼이 화면 밖으로 밀리지 않게 한다.
          */}
          <div className={visiblePanelStyle} style={{ height: toHeightCss(sheetHeight) }}>
            <div className={handleStyle} />
            {title ? (
              <Drawer.Title className={titleStyle}>{title}</Drawer.Title>
            ) : (
              <Drawer.Title className={srOnlyStyle}>상세</Drawer.Title>
            )}
            <div className={bodyStyle}>{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
