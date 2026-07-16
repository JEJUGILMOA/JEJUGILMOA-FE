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
  }),
  z.object({ type: z.literal('ANDROID_BACK') }),
  z.object({
    type: z.literal('KEYBOARD_VISIBLE'),
    visible: z.boolean(),
    height: z.number().optional(),
  }),
])
