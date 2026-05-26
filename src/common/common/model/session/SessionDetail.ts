import { z } from "zod"
import { SessionStage } from "./SessionStage"
import { SessionStatus } from "./SessionStatus"
import { MessageTone } from "../message/MessageTone"
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
  stage: z.nativeEnum(SessionStage),
  status: z.nativeEnum(SessionStatus),
  tone: z.nativeEnum(MessageTone),
  title: z.string().optional(),
  theme: SessionThemeSchema.optional(),
  messages: z.array(SessionMessageSchema),
})
