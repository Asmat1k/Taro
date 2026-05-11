import { injectable } from "inversify"
import i18n from "@i18n"
import {
  SessionStatus,
  SessionStage,
  type Session,
  MessageTone,
  type SessionId,
} from "../model"

export const SessionTransport$type = Symbol("SessionTransport")

export interface SessionTransport {
  listSessions(): Promise<Array<Session>>
  createPredictionSession(tone: MessageTone, message: string): Promise<SessionId>
}

@injectable()
export class SessionTransportImpl implements SessionTransport {

  async listSessions(): Promise<Array<Session>> {
    // GET /sessions
    // headers:
    // X-Real-IP: string (required)
    // Success 200:
    // { sessions: Array<{ sessionId: uuid, title?: string, stage, status }> }
    // Errors:
    // 401 Unauthorized (typed structure)
    // 500 Exception (typed structure)
    // Пока транспортный уровень в common: возвращаем мок.
    return Promise.resolve([
      {
        sessionId: "6b239a23-4f1d-4f9e-a18f-4368f2fb9681",
        title: i18n.t("mock.sessionSalesForecast"),
        stage: SessionStage.prediction,
        status: SessionStatus.done,
      },
      {
        sessionId: "c39e0097-0396-49f1-a146-31c6ae86fd65",
        title: i18n.t("mock.sessionHypothesis"),
        stage: SessionStage.clarification,
        status: SessionStatus.inProgress,
      },
      {
        sessionId: "dc91f66e-70be-4aeb-946c-4cb53ca50270",
        stage: SessionStage.prediction,
        status: SessionStatus.pending,
      },
    ])
  }

  async createPredictionSession(tone: MessageTone, message: string): Promise<SessionId> {
    // @ts-expect-error TS6133 — тело запроса для будущего вызова API
    const requestBody = {
      tone,
      message,
    }
    return Promise.resolve(crypto.randomUUID())
  }
}
