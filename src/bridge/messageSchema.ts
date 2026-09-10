import { z } from 'zod'

export const geoCoordsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
})

/** API가 null을 줄 수 있어 bridge user.profileImageUrl은 nullish → undefined */
const bridgeAuthUserSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  profileImageUrl: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
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
          categoryName: z.string().optional(),
        }),
      )
      .optional(),
    places: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          latitude: z.number(),
          longitude: z.number(),
          categoryName: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      )
      .optional(),
    heatmap: z
      .array(
        z.object({
          latitude: z.number(),
          longitude: z.number(),
          level: z.enum(['CROWDED', 'MODERATE']),
          intensity: z.number(),
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
  z.object({ type: z.literal('REQUEST_MAP_REGION') }),
  z.object({
    type: z.literal('SET_PLAN_SUMMARIES'),
    plans: z
      .array(
        z.object({
          planId: z.number(),
          title: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED']),
          waypointCount: z.number(),
          nights: z.number(),
          days: z.number(),
          dDay: z.number(),
        }),
      )
      .optional(),
    error: z.string().optional(),
  }),
  z.object({
    type: z.literal('MAP_PLAN_DETAIL'),
    planId: z.number(),
    title: z.string(),
    nights: z.number(),
    days: z.number(),
    durationLabel: z.string(),
    waypoints: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        categoryName: z.string().optional(),
        imageUrl: z.string().optional(),
        address: z.string().optional(),
        order: z.number(),
        dayNumber: z.number().optional(),
      }),
    ),
    routePath: z
      .array(z.object({ latitude: z.number(), longitude: z.number() }))
      .optional(),
    dayRoutes: z
      .array(
        z.object({
          dayNumber: z.number(),
          path: z.array(z.object({ latitude: z.number(), longitude: z.number() })),
        }),
      )
      .optional(),
    legs: z
      .array(
        z.object({
          fromId: z.string(),
          toId: z.string(),
          durationMinutes: z.number(),
          distanceKm: z.number(),
          dayNumber: z.number().optional(),
        }),
      )
      .optional(),
    error: z.string().optional(),
  }),
  z.object({
    type: z.literal('MAP_CURRENT_TRIP'),
    trip: z
      .object({
        tripId: z.number(),
        title: z.string(),
        status: z.string(),
        actualStartedAt: z.string().optional(),
        waypoints: z.array(
          z.object({
            waypointId: z.number(),
            visitDate: z.string(),
            sequenceOrder: z.number(),
            placeId: z.number(),
            placeName: z.string(),
            categoryName: z.string().optional(),
            imageUrl: z.string().optional(),
            address: z.string().optional(),
            visited: z.boolean(),
            visitedAt: z.string().optional(),
            skipped: z.boolean().optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
          }),
        ),
      })
      .nullable(),
    error: z.string().optional(),
  }),
  z.object({
    type: z.literal('MAP_TRIP_VISIT_RESULT'),
    tripId: z.number(),
    waypoints: z.array(
      z.object({
        waypointId: z.number(),
        visitDate: z.string(),
        sequenceOrder: z.number(),
        placeId: z.number(),
        placeName: z.string(),
        categoryName: z.string().optional(),
        imageUrl: z.string().optional(),
        address: z.string().optional(),
        visited: z.boolean(),
        visitedAt: z.string().optional(),
        skipped: z.boolean().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    ),
    error: z.string().optional(),
  }),
  z.object({
    type: z.literal('MAP_TRIP_COMPLETE_RESULT'),
    tripId: z.number(),
    title: z.string().optional(),
    earnedBadges: z
      .array(
        z.object({
          badgeId: z.number(),
          name: z.string(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
        }),
      )
      .optional(),
    error: z.string().optional(),
  }),
  z.object({
    type: z.literal('MAP_ERROR'),
    code: z.string().optional(),
    message: z.string(),
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
  z.object({ type: z.literal('REQUEST_APPLE_LOGIN') }),
  z.object({
    type: z.literal('OPEN_OAUTH_LOGIN'),
    url: z.string().url(),
    title: z.string().optional(),
    provider: z.enum(['kakao', 'google', 'naver']).optional(),
  }),
  z.object({
    type: z.literal('LOGIN_SUCCESS'),
    provider: z.enum(['kakao', 'google', 'naver', 'apple', 'temp']).optional(),
    returnTo: z.string().optional(),
    accessToken: z.string().min(1).optional(),
    user: bridgeAuthUserSchema.optional(),
  }),
  z.object({ type: z.literal('LOGOUT') }),
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
    user: bridgeAuthUserSchema.optional(),
  }),
  z.object({
    type: z.literal('AUTH_SESSION'),
    user: bridgeAuthUserSchema,
  }),
  z.object({ type: z.literal('AUTH_GUEST') }),
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
    type: z.literal('MAP_REGION_CHANGED'),
    minLat: z.number(),
    maxLat: z.number(),
    minLng: z.number(),
    maxLng: z.number(),
  }),
  z.object({ type: z.literal('REQUEST_PLAN_SUMMARIES') }),
  z.object({
    type: z.literal('REQUEST_PLAN_DETAIL'),
    planId: z.number(),
  }),
  z.object({ type: z.literal('REQUEST_CURRENT_TRIP') }),
  z.object({
    type: z.literal('REQUEST_MAP_SEARCH'),
    minLat: z.number(),
    maxLat: z.number(),
    minLng: z.number(),
    maxLng: z.number(),
    category: z.string().optional(),
  }),
  z.object({
    type: z.literal('REQUEST_TRIP_VISIT'),
    tripId: z.number(),
    waypointId: z.number(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  z.object({
    type: z.literal('REQUEST_TRIP_COMPLETE'),
    tripId: z.number(),
  }),
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
  z.object({
    type: z.literal('TAB_POP_TO_ROOT'),
    path: z.enum(['/', '/plan', '/record', '/my', '/map']),
  }),
  z.object({
    type: z.literal('APPLE_CREDENTIAL'),
    identityToken: z.string().min(1),
    rawNonce: z.string().min(1),
    authorizationCode: z.string().optional(),
    email: z.string().optional(),
    fullName: z
      .object({
        givenName: z.string().nullable().optional(),
        familyName: z.string().nullable().optional(),
      })
      .optional(),
  }),
  z.object({ type: z.literal('APPLE_LOGIN_CANCELLED') }),
  z.object({
    type: z.literal('APPLE_LOGIN_ERROR'),
    message: z.string(),
  }),
])
