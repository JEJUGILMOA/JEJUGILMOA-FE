import { useState } from 'react'
import { Bookmark, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { IconButton } from '@/components/ui/IconButton/IconButton'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { TextField } from '@/components/ui/TextField/TextField'
import { TextArea } from '@/components/ui/TextArea/TextArea'
import { ImageUpload } from '@/components/ui/ImageUpload/ImageUpload'
import { DateField } from '@/components/ui/DateField/DateField'
import { Tabs } from '@/components/ui/Tabs/Tabs'
import { SegmentedControl } from '@/components/ui/SegmentedControl/SegmentedControl'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { Modal } from '@/components/ui/Modal/Modal'
import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import {
  labelStyle,
  pageStyle,
  rowStyle,
  sectionStyle,
  sectionTitleStyle,
} from './TestPageJinsung.css.ts'

export function TestPageJinsung() {
  const [search, setSearch] = useState('')
  const [review, setReview] = useState('오름 노을이 정말 예뻤어요')
  const [password, setPassword] = useState('password')
  const [price, setPrice] = useState('300000')
  const [date, setDate] = useState('2026.07.20')
  const [tab, setTab] = useState('course')
  const [segment, setSegment] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([
    { id: '1', label: 'AI 공학관', type: 'history' as const },
    { id: '2', label: '쩡이네 분식', type: 'history' as const },
    { id: '3', label: '화리화리', type: 'place' as const },
  ])

  return (
    <div className={pageStyle}>
      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>SearchBar</h2>
        <SearchBar
          value={search}
          onChange={setSearch}
          suggestions={suggestions}
          onSelectSuggestion={(item) => setSearch(item.label)}
          onRemoveSuggestion={(item) =>
            setSuggestions((prev) => prev.filter((s) => s.id !== item.id))
          }
        />
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>TextField / TextArea / ImageUpload / DateField</h2>
        <TextField
          label="한줄 후기"
          value={review}
          onChange={setReview}
          maxLength={20}
          showCount
        />
        <TextField
          value={price}
          onChange={setPrice}
          prefix={<span>₩</span>}
          suffix={<span>/ 2인</span>}
        />
        <TextField
          label="비밀번호 토글"
          value={password}
          onChange={setPassword}
          type="password"
          togglePassword
        />
        <TextField value="잘못된 입력입니다." onChange={() => {}} error="형식을 확인해주세요" />
        <DateField value={date} onChange={setDate} />
        <TextArea
          value="완전 좋았어요!! 음식도 맛있고 어쩌고 저쩌고"
          onChange={() => {}}
          maxLength={400}
        />
        <ImageUpload />
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>Tabs / SegmentedControl</h2>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'course', label: '코스 추천', content: '코스 추천 패널입니다.' },
            { value: 'food', label: '맛집', content: '맛집 패널입니다.' },
            { value: 'stay', label: '숙소', content: '숙소 패널입니다.' },
            { value: 'soon', label: '준비중', content: '준비중 패널입니다.', disabled: true },
          ]}
        />
        <SegmentedControl
          value={segment}
          onChange={setSegment}
          aria-label="장소 필터"
          items={[
            { value: 'all', label: '전체' },
            { value: 'food', label: '맛집' },
            { value: 'nature', label: '자연' },
          ]}
        />
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>PageHeader</h2>
        <PageHeader title="코스 추천" rightSlot={<MoreVertical size={16} />} />
        <PageHeader
          title="코스 추천"
          showBack
          onBack={() => undefined}
          rightSlot={<MoreVertical size={16} />}
        />
        <PageHeader
          title="코스 추천"
          showBack
          onBack={() => undefined}
          rightSlot={<Bookmark size={20} />}
        />
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>Toast (sonner)</h2>
        <div className={rowStyle}>
          <Button onClick={() => toast.success('코스가 저장되었습니다.')}>
            Sonner 토스트 열기
          </Button>
          <Button variant="danger" onClick={() => toast.error('코스 저장에 실패했습니다.')}>
            실패 토스트
          </Button>
          <Button variant="outline" onClick={() => toast.info('새로운 코스가 업데이트 되었습니다.')}>
            안내 토스트
          </Button>
        </div>
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>Modal / BottomSheet</h2>
        <div className={rowStyle}>
          <Button onClick={() => setModalOpen(true)}>저장 모달</Button>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            삭제 모달
          </Button>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            BottomSheet
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="코스를 저장할까요?"
          description="저장한 코스는 마이페이지에서 다시 볼 수 있어요."
          actions={[
            {
              label: '취소',
              onClick: () => setModalOpen(false),
              variant: 'outline',
              grow: false,
            },
            {
              label: '저장하기',
              onClick: () => setModalOpen(false),
              variant: 'primary',
            },
          ]}
        />
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="코스를 삭제할까요?"
          description="삭제한 코스는 복구할 수 없어요."
          actions={[
            {
              label: '취소',
              onClick: () => setDeleteModalOpen(false),
              variant: 'ghost',
              grow: false,
            },
            {
              label: '삭제하기',
              onClick: () => setDeleteModalOpen(false),
              variant: 'danger',
            },
          ]}
        />
        <BottomSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="협재 해수욕장"
          initialHeight={0.6}
          minHeight={0.3}
          maxHeight={1}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, color: '#5B5C60', fontSize: 14, lineHeight: 1.5 }}>
              처음엔 중간 높이로 열리고, 드래그하면 최소/최대로 스냅됩니다. 뒤 영역을 누르면
              닫혀요.
            </p>
            <Button variant="primary" size="lg" fullWidth>
              코스 추천
            </Button>
          </div>
        </BottomSheet>
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>PlaceCard</h2>
        <div className={rowStyle}>
          <PlaceCard variant="vertical" width="100%" title="쩡이네 분식" rating={4.16} meta='제주 한림읍 · 도보 10분' />
          <PlaceCard
            variant="horizontal"
            title="협재 해수욕장"
            meta="제주 한림읍 · 도보 10분"
            badges={[
              { label: '무료' },
              { label: '4.8', status: 'neutral' },
            ]}
            width="100%"
          />
          <PlaceCard variant="compact" width="100%" title="화리화리" distance="1.2km" />
        </div>
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>Empty / Loading / Skeleton</h2>
        <Empty
          tone="neutral"
          title="검색 결과가 없어요"
          description="다른 키워드로 검색해보세요"
        />
        <Empty
          tone="primary"
          title="아직 찜한 장소가 없어요"
          description="마음에 드는 장소를 찜해보세요"
          action={<Button size="md">장소 둘러보기</Button>}
        />
        <Empty
          tone="danger"
          title="문제가 발생했어요"
          description="잠시 후 다시 시도해주세요"
          action={
            <Button variant="outline" size="md">
              다시 시도
            </Button>
          }
        />
        <Loading />
        <div className={rowStyle}>
          <span className={labelStyle}>Skeleton</span>
          <Skeleton width={160} height={87} />
          <Skeleton width="60%" height={16} />
        </div>
      </section>

      <section className={sectionStyle}>
        <h2 className={sectionTitleStyle}>Button / IconButton</h2>
        <div className={rowStyle}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <IconButton variant="primary" leftIcon={<Bookmark size={16} />}>
            저장
          </IconButton>
        </div>
      </section>
    </div>
  )
}
