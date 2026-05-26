import { injectable } from "inversify"
import i18n from "@i18n"
import {
  SessionStatus,
  SessionStage,
  type Session,
  MessageTone,
  type SessionId,
  type SessionDetail,
  SessionTheme,
  MessageRole,
} from "../model"
import { type ApiStreamHandlers } from "../model"

export const SessionTransport$type = Symbol("SessionTransport")

export interface SessionTransport {
  listSessions(): Promise<Array<Session>>
  createPredictionSession(tone: MessageTone, message: string): Promise<SessionId>
  getSession(sessionId: SessionId): Promise<SessionDetail>
  createClarificationSession(sessionId: SessionId, message: string): Promise<SessionId>
  streamSession(sessionId: SessionId, handlers: ApiStreamHandlers): AbortController
}

@injectable()
export class SessionTransportImpl implements SessionTransport {

  async listSessions(): Promise<Array<Session>> {
    // GET /sessions
    // headers: X-Real-IP: string (required)
    // Success 200: { sessions: Array<{ sessionId, title?, stage, status }> }
    // Errors: 401 Unauthorized, 500 Exception
    return Promise.resolve([
      {
        sessionId: "6b239a23-4f1d-4f9e-a18f-4368f2fb9681",
        title: i18n.t("mock.sessionSalesForecast"),
        stage: SessionStage.PREDICTION,
        status: SessionStatus.DONE,
      },
      {
        sessionId: "c39e0097-0396-49f1-a146-31c6ae86fd65",
        title: i18n.t("mock.sessionHypothesis"),
        stage: SessionStage.CLARIFICATION,
        status: SessionStatus.IN_PROGRESS,
      },
      {
        sessionId: "dc91f66e-70be-4aeb-946c-4cb53ca50270",
        stage: SessionStage.PREDICTION,
        status: SessionStatus.PENDING,
      },
    ])
  }

  async createPredictionSession(tone: MessageTone, message: string): Promise<SessionId> {
    // POST /session/prediction
    // headers: X-Real-IP: string (required)
    // body: { tone, message }
    // Success 202: { sessionId }
    // Errors: 401, 400, 422, 500
    // @ts-expect-error TS6133 — тело запроса для будущего API-вызова
    const _requestBody = { tone, message }
    return Promise.resolve(crypto.randomUUID())
  }

  async getSession(sessionId: SessionId): Promise<SessionDetail> {
    // GET /session
    // headers: X-Real-IP: string, X-Session-Id: uuid (required)
    // Success 200: SessionDetail
    // Errors: 401, 403, 500
    // @ts-expect-error TS6133 — параметр для будущего API-вызова
    const _sessionId = sessionId
    return Promise.resolve({
      stage: SessionStage.PREDICTION,
      status: SessionStatus.DONE,
      tone: MessageTone.NEUTRAL,
      title: i18n.t("mock.sessionSalesForecast"),
      theme: SessionTheme.CAREER,
      messages: [
        {
          objectType: "message" as const,
          role: MessageRole.USER,
          content: i18n.t("mock.userQuestion"),
        },
        {
          objectType: "card" as const,
          cardId: 1,
          title: i18n.t("mock.card1Title"),
          meaning: i18n.t("mock.card1Meaning"),
          arcana: "major" as const,
          reversed: false,
        },
        {
          objectType: "card" as const,
          cardId: 2,
          title: i18n.t("mock.card2Title"),
          meaning: i18n.t("mock.card2Meaning"),
          arcana: "major" as const,
          reversed: false,
        },
        {
          objectType: "card" as const,
          cardId: 3,
          title: i18n.t("mock.card3Title"),
          meaning: i18n.t("mock.card3Meaning"),
          arcana: "minor" as const,
          reversed: true,
        },
        {
          objectType: "message" as const,
          role: MessageRole.ASSISTANT,
          content: i18n.t("mock.assistantResponse"),
        },
      ],
    })
  }

  async createClarificationSession(sessionId: SessionId, message: string): Promise<SessionId> {
    // POST /session/clarification
    // headers: X-Real-IP: string, X-Session-Id: uuid (required)
    // body: { message }
    // Success 202: { sessionId }
    // Errors: 401, 403, 400, 409, 500
    // @ts-expect-error TS6133 — параметры для будущего API-вызова
    const _body = { sessionId, message }
    return Promise.resolve(sessionId)
  }

  streamSession(sessionId: SessionId, handlers: ApiStreamHandlers): AbortController {
    // GET /session/streaming
    // headers: X-Real-IP: string, X-Session-Id: uuid (required)
    // Response: SSE stream (text/event-stream)
    // Events: error | theme | cards | message
    // @ts-expect-error TS6133 — параметр для будущего API-вызова
    const _sessionId = sessionId

    const controller = new AbortController()
    const timers: Array<ReturnType<typeof setTimeout>> = []

    const fire = (delay: number, event: string, data: unknown): void => {
      timers.push(
        setTimeout(() => {
          if (!controller.signal.aborted) {
            handlers.onEvent(event, JSON.stringify(data), null)
          }
        }, delay),
      )
    }

    handlers.onOpen?.()

    fire(400, "theme", { theme: SessionTheme.CAREER })

    fire(1000, "cards", {
      messages: [
        {
          objectType: "card",
          cardId: 1,
          title: i18n.t("mock.card1Title"),
          meaning: i18n.t("mock.card1Meaning"),
          arcana: "major",
          reversed: false,
        },
        {
          objectType: "card",
          cardId: 2,
          title: i18n.t("mock.card2Title"),
          meaning: i18n.t("mock.card2Meaning"),
          arcana: "major",
          reversed: false,
        },
        {
          objectType: "card",
          cardId: 3,
          title: i18n.t("mock.card3Title"),
          meaning: i18n.t("mock.card3Meaning"),
          arcana: "minor",
          reversed: true,
        },
      ],
    })

    const fullText = i18n.t("mock.assistantResponse")
    const words = fullText.split(" ")
    const startDelay = 1800

    words.forEach((word, index) => {
      fire(startDelay + index * 80, "message", {
        messages: [
          {
            objectType: "message",
            role: MessageRole.ASSISTANT,
            content: index === 0 ? word : ` ${word}`,
          },
        ],
      })
    })

    const closeDelay = startDelay + words.length * 80 + 300
    timers.push(
      setTimeout(() => {
        if (!controller.signal.aborted) {
          handlers.onClose?.()
        }
      }, closeDelay),
    )

    controller.signal.addEventListener("abort", () => {
      timers.forEach(clearTimeout)
    })

    return controller
  }

  constructor() {}
}
