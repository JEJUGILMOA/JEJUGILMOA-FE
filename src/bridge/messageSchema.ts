import { z } from 'zod'

export const geoCoordsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
})

export const webToNativeMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('WEB_READY') }),
  z.object({ type: z.literal('REQUEST_LOCATION') }),
  z.object({
    type: z.literal('REQUEST_BACK_HANDLER'),
    enabled: z.boolean(),
  }),
  z.object({
    type: z.literal('OPEN_EXTERNAL_URL'),
    url: z.string().url(),
  }),
  z.object({
    type: z.literal('HAPTIC'),
    style: z.enum(['light', 'medium', 'heavy']).optional(),
  }),
  z.object({ type: z.literal('CLOSE_WEBVIEW') }),
  z.object({
    type: z.literal('SET_HEADER'),
    title: z.string().optional(),
    showBack: z.boolean().optional(),
    visible: z.boolean().optional(),
    rightText: z.string().optional(),
    actions: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          tone: z.enum(['default', 'muted', 'primary']).optional(),
          icon: z.enum(['more', 'bookmark']).optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    type: z.literal('SET_MAP'),
    visible: z.boolean(),
    departure: z
      .object({
        id: z.string(),
        title: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
      .nullable()
      .optional(),
    stops: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          order: z.number(),
          mustVisit: z.boolean().optional(),
        }),
      )
      .optional(),
    unassigned: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          latitude: z.number(),
          longitude: z.number(),
        }),
      )
      .optional(),
    overlayTop: z.number().optional(),
    sheetHeight: z.number().optional(),
    cameraFitKey: z.string().optional(),
    webOnTop: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('MAP_ZOOM'),
    delta: z.number(),
  }),
  z.object({
    type: z.literal('SET_MODAL'),
    visible: z.boolean(),
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    actions: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'danger']).optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    type: z.literal('SET_TOAST'),
    visible: z.boolean(),
    id: z.string().optional(),
    kind: z.enum(['success', 'error', 'info']).optional(),
    message: z.string().optional(),
    duration: z.number().optional(),
    actions: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          tone: z.enum(['default', 'primary', 'danger']).optional(),
        }),
      )
      .optional(),
  }),
  z.object({
    type: z.literal('SET_ITINERARY_CHROME'),
    visible: z.boolean(),
    day: z.number().optional(),
    totalDays: z.number().optional(),
    dateLabel: z.string().optional(),
    searchQuery: z.string().optional(),
    searchPlaceholder: z.string().optional(),
    isSelectingDeparture: z.boolean().optional(),
    nextLabel: z.string().optional(),
    sheetTitle: z.string().optional(),
  }),
])

export const nativeToWebMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('NATIVE_READY'),
    platform: z.enum(['ios', 'android']),
  }),
  z.object({
    type: z.literal('LOCATION_UPDATE'),
    location: geoCoordsSchema,
  }),
  z.object({
    type: z.literal('LOCATION_ERROR'),
    message: z.string(),
  }),
  z.object({
    type: z.literal('AUTH_TOKEN'),
    accessToken: z.string().min(1),
    user: z
      .object({
        id: z.string(),
        nickname: z.string(),
        profileImageUrl: z.string().optional(),
      })
      .optional(),
  }),
  z.object({ type: z.literal('ANDROID_BACK') }),
  z.object({ type: z.literal('HEADER_BACK') }),
  z.object({
    type: z.literal('HEADER_ACTION'),
    id: z.string(),
  }),
  z.object({
    type: z.literal('MAP_ASSIGN_PLACE'),
    id: z.string(),
  }),
  z.object({ type: z.literal('MAP_TAPPED') }),
  z.object({
    type: z.literal('MODAL_ACTION'),
    id: z.string(),
  }),
  z.object({ type: z.literal('MODAL_DISMISS') }),
  z.object({
    type: z.literal('TOAST_ACTION'),
    id: z.string(),
  }),
  z.object({
    type: z.literal('ITINERARY_DAY'),
    day: z.number(),
  }),
  z.object({
    type: z.literal('ITINERARY_SEARCH'),
    query: z.string(),
  }),
  z.object({ type: z.literal('ITINERARY_NEXT') }),
  z.object({ type: z.literal('ITINERARY_DEPARTURE_CANCEL') }),
  z.object({
    type: z.literal('NATIVE_LAYOUT'),
    screenHeight: z.number(),
  }),
  z.object({
    type: z.literal('KEYBOARD_VISIBLE'),
    visible: z.boolean(),
    height: z.number().optional(),
  }),
])
