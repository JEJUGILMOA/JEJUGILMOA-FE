import { formatJoinedAt } from '@/features/auth/format'
import type { TravelRecordCard } from './schemas'
import type { SharedRecord } from '@/pages/mypage/data/mockMyPage'

export function mapRecordCardToSharedRecord(record: TravelRecordCard): SharedRecord {
  const stops = record.visitedPlaceCount ?? record.placeCount ?? 0
  const link =
    record.shareUrl ??
    (record.shareToken
      ? `${window.location.origin}/record/${record.recordId}`
      : `${window.location.origin}/record/${record.recordId}`)

  return {
    id: record.recordId,
    title: record.title,
    date: formatJoinedAt(record.createdAt),
    stops,
    views: record.viewCount ?? 0,
    likes: record.likeCount ?? 0,
    comments: record.commentCount ?? 0,
    link,
    coverTone: 'warm',
  }
}
