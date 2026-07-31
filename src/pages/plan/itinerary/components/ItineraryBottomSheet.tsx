import { useState, type ReactNode } from 'react'
import { Drawer } from 'vaul'
import { bodyStyle, contentStyle, handleStyle, titleStyle } from './ItineraryBottomSheet.css.ts'

const SNAP_POINTS = [0.3, 0.6, 0.92]

export type ItineraryBottomSheetProps = {
  title: string
  children: ReactNode
}

/**
 * 지도 위에 항상 도킹되는 논모달 바텀시트. 오버레이 없이 지도와 동시에 조작 가능하며,
 * peek(0.3) · half(0.6) · full(0.92) 세 단계로 드래그해 높이를 바꿀 수 있다.
 */
export function ItineraryBottomSheet({ title, children }: ItineraryBottomSheetProps) {
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>(SNAP_POINTS[0])

  return (
    <Drawer.Root
      open
      onOpenChange={() => {}}
      modal={false}
      dismissible={false}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Content className={contentStyle} aria-describedby={undefined}>
          <div className={handleStyle} />
          <Drawer.Title className={titleStyle}>{title}</Drawer.Title>
          <div className={bodyStyle}>{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
