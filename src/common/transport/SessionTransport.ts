import { injectable } from "inversify"
import { SessionStatus, SessionStage, type Session } from "../model"

export const SessionTransport$type = Symbol("SessionTransport")

export interface SessionsResponse {
  sessions: Session[]
}

export interface SessionTransport {
  listSessions(): Promise<SessionsResponse>
}

@injectable()
export class SessionTransportImpl implements SessionTransport {
  async listSessions(): Promise<SessionsResponse> {
    // GET /sessions
    // headers:
    // X-Real-IP: string (required)
    // Success 200:
    // { sessions: Array<{ sessionId: uuid, title?: string, stage, status }> }
    // Errors:
    // 401 Unauthorized (typed structure)
    // 500 Exception (typed structure)
    // Пока транспортный уровень в common: возвращаем мок.
    return Promise.resolve({
      sessions: [
        {
          sessionId: "6b239a23-4f1d-4f9e-a18f-4368f2fb9681",
          title: "Прогноз продаж Q3",
          stage: SessionStage.prediction,
          status: SessionStatus.done,
        },
        {
          sessionId: "c39e0097-0396-49f1-a146-31c6ae86fd65",
          title: "Уточнение гипотезы",
          stage: SessionStage.clarification,
          status: SessionStatus.inProgress,
        },
        {
          sessionId: "dc91f66e-70be-4aeb-946c-4cb53ca50270",
          stage: SessionStage.prediction,
          status: SessionStatus.pending,
        },
      ],
    })
  }
}
