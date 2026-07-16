import { Card } from '@/components/ui/Card/Card'
import { Empty } from '@/components/ui/Empty/Empty'

export function PlanPage() {
  return (
    <Card title="여행 계획">
      <Empty
        title="아직 계획이 없어요"
        description="제주 일정을 만들어 여행을 준비해 보세요."
      />
    </Card>
  )
}
