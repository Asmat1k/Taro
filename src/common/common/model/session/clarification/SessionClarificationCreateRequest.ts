import { z } from "zod"

export interface SessionClarificationCreateRequest {
  message: string
}

export const SessionClarificationCreateRequestSchema = z.object({
  message: z.string().min(1),
})
