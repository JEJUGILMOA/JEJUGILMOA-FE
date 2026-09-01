import { apiGet } from '@/api/http'
import { recordPageSchema, type RecordPage } from './schemas'

export type FetchRecordCardsParams = {
  mine?: boolean
  page?: number
  size?: number
}

export async function fetchRecordCards(params?: FetchRecordCardsParams): Promise<RecordPage> {
  const data = await apiGet<unknown>('/records', {
    params: {
      view: 'CARD',
      mine: params?.mine ?? false,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    },
  })
  return recordPageSchema.parse(data)
}
