import i18n from "@i18n"
import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import {
  MessageTone,
  SessionStatus,
  SessionStage,
  SessionTransport$type,
  type SessionTransport,
  makeLogger,
  type SessionId
} from "@common"
import { type ChatsStore, ChatsStore$type } from "../store"

export const ChatsService$type = Symbol("ChatsService")

export interface ChatsService {
  loadSessions(): Promise<void>
  createSession(): Promise<void>
  selectSession(sessionId: string): void
}

@injectable()
export class ChatsServiceImpl implements ChatsService {

  async loadSessions(): Promise<void> {
    this.log.info("Load sessions")
    try {
      runInAction(() => {
        this.chatsStore.isLoadingSessions = true
      })
      const sessions = await this.sessionTransport.listSessions()
      runInAction(() => {
        this.chatsStore.sessions = sessions
        this.chatsStore.selectedSessionId = sessions[0]?.sessionId
        this.chatsStore.isLoadingSessions = false
      })
      this.log.info("Load sessions | done")
    } catch (error) {
      this.log.error("Load sessions | failed | error={}", error)
    }
  }

  async createSession(): Promise<void> {
    this.log.info("Create session")
    try {
      const newChatTitle = i18n.t("chat.newChat")
      const sessionId = await this.sessionTransport.createPredictionSession(
        MessageTone.NEUTRAL,
        newChatTitle,
      )
      this.updateSessions(sessionId, newChatTitle)
      this.log.info("Create session | done | sessionId={}", sessionId)
    } catch (error) {
      this.log.error("Create session | failed | error={}", error)
    }
  }

  private updateSessions(sessionId: SessionId, newChatTitle: string): void {
     runInAction(() => {
      this.chatsStore.sessions = [
        {
          sessionId,
          title: newChatTitle,
          stage: SessionStage.PREDICTION,
          status: SessionStatus.PENDING,
        },
        ...this.chatsStore.sessions,
      ]
      this.chatsStore.selectedSessionId = sessionId
    })
  }

  selectSession(sessionId: string): void {
    runInAction(() => {
      this.chatsStore.selectedSessionId = sessionId
    })
  }

  constructor(
    @inject(ChatsStore$type) private chatsStore: ChatsStore,
    @inject(SessionTransport$type) private sessionTransport: SessionTransport,
  ) {
  }

   private readonly log = makeLogger("chat.chats")
}
