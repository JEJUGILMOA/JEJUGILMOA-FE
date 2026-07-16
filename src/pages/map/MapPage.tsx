import { Card } from '@/components/ui/Card/Card'
import { Button } from '@/components/ui/Button/Button'
import { nativeBridge } from '@/bridge/nativeBridge'
import { useAppStore } from '@/stores/appStore'
import { pageStyle } from './MapPage.css.ts'

export function MapPage() {
  const location = useAppStore((s) => s.nativeLocation)

  return (
    <div className={pageStyle}>
      <Card title="지도">
        <p>지도 화면은 이후 네이티브/웹 지도 SDK와 연결됩니다.</p>
        {location ? (
          <p>
            현재 위치: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        ) : (
          <p>위치 정보가 아직 없습니다.</p>
        )}
        <Button variant="secondary" onClick={() => nativeBridge.requestNativeLocation()}>
          위치 요청
        </Button>
      </Card>
    </div>
  )
}
