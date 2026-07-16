import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'

export function RecordPage() {
  return (
    <Card title="여행 기록">
      <Empty
        title="기록이 비어 있어요"
        description="방문한 장소와 후기를 남겨보세요."
      />
    </Card>
  )
}
