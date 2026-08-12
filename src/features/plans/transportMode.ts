import type { TransportMode } from './types'

/** 제주에는 공항이 하나, 여객선이 닿는 항구도 사실상 하나뿐이라 교통편만 고르면 도착지가 자동으로 정해진다. */
export const ARRIVAL_POINT_BY_TRANSPORT_MODE: Record<TransportMode, string> = {
  비행기: '제주국제공항',
  배: '제주항',
}
