import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import {
  makeLogger,
  MessageRole,
  MessageTone,
  SessionStage,
  SessionStatus,
  SessionTransport$type,
  type SessionTransport,
  type SessionId,
  type CardMessage,
  type TextMessage,
  type SessionMessage,
  type SessionTheme,
  type ChatItemMessage,
} from "@common"
import { ChatsStore$type, type ChatsStore, SessionStore$type, type SessionStore } from "../store"

export const SessionService$type = Symbol("SessionService")

export interface SessionService {
  loadSession(sessionId: SessionId): Promise<void>
  clearSession(): void
  sendMessage(message: string): Promise<void>
  setTone(tone: MessageTone): void
  stopStream(): void
}

@injectable()
export class SessionServiceImpl implements SessionService {

  private activeController?: AbortController

  async loadSession(sessionId: SessionId): Promise<void> {
    this.log.info("Load session | sessionId={}", sessionId)

    if (this.sessionStore.isStreaming) {
      this.log.info("Load session | skipped, streaming is active | sessionId={}", sessionId)
      return
    }

    try {
      runInAction(() => {
        this.sessionStore.isLoadingSession = true
        this.sessionStore.chatItems = []
      })

      const detail = await this.sessionTransport.getSession(sessionId)

      runInAction(() => {
        this.sessionStore.chatItems = []

        if (detail.theme) {
          this.sessionStore.chatItems.push({
            type: "theme",
            id: crypto.randomUUID(),
            theme: detail.theme,
          })
        }

        const cardBatch: Array<CardMessage> = []

        const flushCardBatch = (): void => {
          if (cardBatch.length > 0) {
            this.sessionStore.chatItems.push({
              type: "cards",
              id: crypto.randomUUID(),
              cards: [ ...cardBatch ],
            })
            cardBatch.length = 0
          }
        }

        for (const msg of detail.messages) {
          if (msg.objectType === "card") {
            cardBatch.push(msg)
          } else {
            flushCardBatch()
            if (msg.role !== MessageRole.SYSTEM) {
              this.sessionStore.chatItems.push({
                type: "message",
                id: crypto.randomUUID(),
                role: msg.role,
                content: msg.content,
                streaming: false,
              })
            }
          }
        }
        flushCardBatch()

        this.sessionStore.isLoadingSession = false
      })

      this.log.info("Load session | done | sessionId={}", sessionId)
    } catch (error) {
      this.log.error("Load session | failed | sessionId={} | error={}", sessionId, error)
      runInAction(() => {
        this.sessionStore.isLoadingSession = false
      })
    }
  }

  clearSession(): void {
    this.log.info("Clear session")
    this.activeController?.abort()
    runInAction(() => {
      this.sessionStore.chatItems = []
      this.sessionStore.isStreaming = false
      this.sessionStore.isLoadingSession = false
    })
  }

  async sendMessage(message: string): Promise<void> {
    this.log.info("Send message")
    const currentSessionId = this.chatsStore.selectedSessionId

    runInAction(() => {
      this.sessionStore.chatItems.push({
        type: "message",
        id: crypto.randomUUID(),
        role: MessageRole.USER,
        content: message,
        streaming: false,
      })
      this.sessionStore.chatItems.push({
        type: "message",
        id: "__streaming__",
        role: MessageRole.ASSISTANT,
        content: "",
        streaming: true,
      })
      this.sessionStore.isStreaming = true
    })

    try {
      let targetSessionId: SessionId

      if (!currentSessionId) {
        const tone = this.sessionStore.selectedTone
        targetSessionId = await this.sessionTransport.createPredictionSession(tone, message)
        runInAction(() => {
          this.chatsStore.sessions = [
            {
              sessionId: targetSessionId,
              stage: SessionStage.PREDICTION,
              status: SessionStatus.IN_PROGRESS,
            },
            ...this.chatsStore.sessions,
          ]
          this.chatsStore.selectedSessionId = targetSessionId
        })
        this.log.info("Send message | created session | sessionId={}", targetSessionId)
      } else {
        targetSessionId = await this.sessionTransport.createClarificationSession(
          currentSessionId,
          message,
        )
        this.log.info("Send message | created clarification | sessionId={}", targetSessionId)
      }

      this.startStream(targetSessionId)
    } catch (error) {
      this.log.error("Send message | failed | error={}", error)
      runInAction(() => {
        const streamingItem = this.findStreamingItem()
        if (streamingItem) {
          streamingItem.content = "⚠️ Ошибка отправки запроса"
          streamingItem.streaming = false
        }
        this.sessionStore.isStreaming = false
      })
    }
  }

  setTone(tone: MessageTone): void {
    runInAction(() => {
      this.sessionStore.selectedTone = tone
    })
  }

  stopStream(): void {
    this.log.info("Stop stream")
    this.activeController?.abort()
    runInAction(() => {
      const streamingItem = this.findStreamingItem()
      if (streamingItem) {
        streamingItem.streaming = false
      }
      this.sessionStore.isStreaming = false
    })
  }

  private startStream(sessionId: SessionId): void {
    this.activeController?.abort()

    this.log.info("Start stream | sessionId={}", sessionId)

    this.activeController = this.sessionTransport.streamSession(sessionId, {
      onOpen: () => {
        this.log.info("Stream opened | sessionId={}", sessionId)
      },

      onEvent: (event: string, data: string) => {
        this.handleStreamEvent(event, data)
      },

      onClose: () => {
        this.log.info("Stream closed | sessionId={}", sessionId)
        this.handleStreamClose()
      },

      onError: (error: Error) => {
        this.log.error("Stream error | sessionId={} | error={}", sessionId, error)
        this.handleStreamClose()
      },
    })
  }

  private handleStreamEvent(event: string, data: string): void {
    try {
      const parsed = JSON.parse(data) as unknown

      runInAction(() => {
        switch (event) {
          case "theme": {
            const themeData = parsed as { theme: SessionTheme }
            this.sessionStore.chatItems.splice(
              this.sessionStore.chatItems.length - 1,
              0,
              {
                type: "theme",
                id: crypto.randomUUID(),
                theme: themeData.theme,
              },
            )
            break
          }

          case "message": {
            const msgData = parsed as { messages: Array<SessionMessage> }

            const cards = msgData.messages.filter(
              (m): m is CardMessage => m.objectType === "card",
            )
            if (cards.length > 0) {
              this.sessionStore.chatItems.splice(
                this.sessionStore.chatItems.length - 1,
                0,
                {
                  type: "cards",
                  id: crypto.randomUUID(),
                  cards,
                },
              )
            }

            const chunk = msgData.messages
              .filter((m): m is TextMessage => m.objectType === "message" && m.role === MessageRole.ASSISTANT)
              .map((m) => m.content)
              .join("")

            const streamingItem = this.findStreamingItem()
            if (streamingItem && chunk) {
              streamingItem.content += chunk
            }
            break
          }

          case "title": {
            const titleData = parsed as { title: string }
            const sessionId = this.chatsStore.selectedSessionId
            if (sessionId && titleData.title) {
              const session = this.chatsStore.sessions.find((s) => s.sessionId === sessionId)
              if (session) {
                session.title = titleData.title
              }
            }
            break
          }

          case "error": {
            const errorData = parsed as { userMessage: string }
            const streamingItem = this.findStreamingItem()
            if (streamingItem) {
              streamingItem.content = `${errorData.userMessage}`
              streamingItem.streaming = false
            }
            this.sessionStore.isStreaming = false
            break
          }

          default:
            this.log.warn("Unknown stream event | event={}", event)
        }
      })
    } catch (error) {
      this.log.error("Failed to parse stream event | event={} | error={}", event, error)
    }
  }

  private handleStreamClose(): void {
    runInAction(() => {
      const streamingItem = this.findStreamingItem()
      if (streamingItem) {
        streamingItem.streaming = false
      }
      this.sessionStore.isStreaming = false
    })
  }

  private findStreamingItem(): ChatItemMessage | undefined {
    return this.sessionStore.chatItems.find(
      (item): item is ChatItemMessage =>
        item.type === "message" && (item as ChatItemMessage).streaming,
    )
  }

  constructor(
    @inject(ChatsStore$type) private chatsStore: ChatsStore,
    @inject(SessionStore$type) private sessionStore: SessionStore,
    @inject(SessionTransport$type) private sessionTransport: SessionTransport,
  ) {}

  private readonly log = makeLogger("chat.session")
}
