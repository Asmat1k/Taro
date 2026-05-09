import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { type ChatsStore, ChatsStore$type } from "../store"
import {
  MessageTone,
  SessionStatus,
  SessionStage,
  SessionTransport$type,
  type SessionTransport,
} from "@common"

export const ChatsService$type = Symbol("ChatsService")

export interface ChatsService {
  loadSessions(): Promise<void>
  createSession(): Promise<void>
  selectSession(sessionId: string): void
}

@injectable()
export class ChatsServiceImpl implements ChatsService {

  async loadSessions(): Promise<void> {
    runInAction(() => {
      this.chatsStore.isLoadingSessions = true
    })
    try {
      const sessions = await this.sessionTransport.listSessions()
      runInAction(() => {
        this.chatsStore.sessions = sessions
        this.chatsStore.selectedSessionId = sessions[0]?.sessionId
      })
    } finally {
      runInAction(() => {
        this.chatsStore.isLoadingSessions = false
      })
    }
  }

  async createSession(): Promise<void> {
    const sessionId  = await this.sessionTransport.createPredictionSession(MessageTone.neutral, "Новый чат")
    runInAction(() => {
      this.chatsStore.sessions = [
        {
          sessionId,
          title: "Новый чат",
          stage: SessionStage.prediction,
          status: SessionStatus.pending,
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
}
