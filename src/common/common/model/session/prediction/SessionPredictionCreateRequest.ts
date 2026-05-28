import { z } from "zod"
import { MessageTone, MessageToneSchema } from "../../message/MessageTone"

export interface SessionPredictionCreateRequest {
  tone: MessageTone
  message: string
}

export const SessionPredictionCreateRequestSchema = z.object({
  tone: MessageToneSchema,
  message: z.string().min(1),
})
