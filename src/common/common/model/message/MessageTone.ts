import { z } from "zod"

export enum MessageTone {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

export const MessageToneSchema = z.nativeEnum(MessageTone)
