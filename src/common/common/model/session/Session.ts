import { SessionStatus } from "./SessionStatus"
import { SessionStage } from "./SessionStage"

export type SessionId = string

export interface Session {
  sessionId: SessionId
  title?: string
  stage: SessionStage
  status: SessionStatus
}
