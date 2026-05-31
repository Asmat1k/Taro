import { inject, injectable } from "inversify"
import { z } from "zod"
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
    SessionIdSchema.parse(sessionId)
    return this.coreTransport.stream(
      {
        url: "/session/streaming",
        headers: { "X-Session-Id": sessionId },
      },
      handlers,
    )
  }

  constructor(
    @inject(CoreTransport$type) private coreTransport: CoreTransport,
  ) {}
}
