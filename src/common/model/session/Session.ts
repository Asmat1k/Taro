import { SessionStatus } from "./SessionStatus"
import { SessionStage } from "./SessionStage"

export interface Session {
  sessionId: string
  title?: string
  stage: SessionStage
  status: SessionStatus
}
