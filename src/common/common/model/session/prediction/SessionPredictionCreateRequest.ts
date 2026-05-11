import { type MessageTone } from "../../message/MessageTone"

export interface SessionPredictionCreateRequest {
  tone: MessageTone
  message: string
}
