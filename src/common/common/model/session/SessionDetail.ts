import { z } from "zod"
import { SessionStage, SessionStageSchema } from "./SessionStage"
import { SessionStatus, SessionStatusSchema } from "./SessionStatus"
import { MessageTone, MessageToneSchema } from "../message/MessageTone"
import { SessionTheme, SessionThemeSchema } from "./SessionTheme"
import { SessionMessageSchema, type SessionMessage } from "../message/SessionMessage"

export interface SessionDetail {
  stage: SessionStage
  status: SessionStatus
  tone: MessageTone
  title?: string
  theme?: SessionTheme
  messages: Array<SessionMessage>
}

export const SessionDetailSchema: z.ZodType<SessionDetail> = z.object({
  stage: SessionStageSchema,
  status: SessionStatusSchema,
  tone: MessageToneSchema,
  title: z.string().optional(),
  theme: SessionThemeSchema.optional(),
  messages: z.array(SessionMessageSchema),
})
