import { z } from "zod"
import { SessionStatus, SessionStatusSchema } from "./SessionStatus"
import { SessionStage, SessionStageSchema } from "./SessionStage"

export type SessionId = string

export const SessionIdSchema = z.string().uuid()

export interface Session {
  sessionId: SessionId
  title?: string
  stage: SessionStage
  status: SessionStatus
}

export const SessionSchema = z.object({
  sessionId: SessionIdSchema,
  title: z.string().optional(),
  stage: SessionStageSchema,
  status: SessionStatusSchema,
})
