import { inject, injectable } from "inversify"
import { z } from "zod"
import i18n from "i18next"
import {
  type Session,
  SessionSchema,
  MessageTone,
  type SessionId,
  SessionIdSchema,
  type SessionDetail,
  SessionDetailSchema,
  SessionPredictionCreateRequestSchema,
  SessionClarificationCreateRequestSchema,
  SessionTheme,
  MessageRole,
  type ApiStreamHandlers,
} from "../model"
import { CoreTransport$type, type CoreTransport } from "./CoreTransport"

export const SessionTransport$type = Symbol("SessionTransport")

export interface SessionTransport {
  listSessions(): Promise<Array<Session>>
  createPredictionSession(tone: MessageTone, message: string): Promise<SessionId>
  getSession(sessionId: SessionId): Promise<SessionDetail>
  createClarificationSession(sessionId: SessionId, message: string): Promise<SessionId>
  streamSession(sessionId: SessionId, handlers: ApiStreamHandlers): AbortController
}

const SessionListResponseSchema = z.object({
  sessions: z.array(SessionSchema),
})

const SessionIdResponseSchema = z.object({
  sessionId: SessionIdSchema,
})

@injectable()
export class SessionTransportImpl implements SessionTransport {

  async listSessions(): Promise<Array<Session>> {
    const response = await this.coreTransport.request({
      url: "/sessions",
      method: "GET",
      responseSchema: SessionListResponseSchema,
    })
    return response.sessions
  }

  async createPredictionSession(tone: MessageTone, message: string): Promise<SessionId> {
    const body = SessionPredictionCreateRequestSchema.parse({ tone, message })
    const response = await this.coreTransport.request({
      url: "/session/prediction",
      method: "POST",
      body,
      responseSchema: SessionIdResponseSchema,
    })
    return response.sessionId
  }

  async getSession(sessionId: SessionId): Promise<SessionDetail> {
    SessionIdSchema.parse(sessionId)
    return this.coreTransport.request({
      url: "/session",
      method: "GET",
      headers: { "X-Session-Id": sessionId },
      responseSchema: SessionDetailSchema,
    })
  }

  async createClarificationSession(sessionId: SessionId, message: string): Promise<SessionId> {
    SessionIdSchema.parse(sessionId)
    const body = SessionClarificationCreateRequestSchema.parse({ message })
    const response = await this.coreTransport.request({
      url: "/session/clarification",
      method: "POST",
      body,
      headers: { "X-Session-Id": sessionId },
      responseSchema: SessionIdResponseSchema,
    })
    return response.sessionId
  }

  streamSession(sessionId: SessionId, handlers: ApiStreamHandlers): AbortController {
    // SessionIdSchema.parse(sessionId)
    // return this.coreTransport.stream(
    //   {
    //     url: "/session/streaming",
    //     headers: { "X-Session-Id": sessionId },
    //   },
    //   handlers,
    // )
    SessionIdSchema.parse(sessionId)

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

  constructor(
    @inject(CoreTransport$type) private coreTransport: CoreTransport,
  ) {}
}
