import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { type ChatsStore, ChatsStore$type } from "../store"
import { SessionStatus, SessionStage, SessionTransport$type, type SessionTransport } from "@common"

export const ChatsService$type = Symbol("ChatsService")

export interface ChatsService {
  loadSessions(): Promise<void>
  createSession(): void
  selectSession(sessionId: string): void
}

@injectable()
export class ChatsServiceImpl implements ChatsService {

  async loadSessions(): Promise<void> {
    runInAction(() => {
      this.chatsStore.isLoadingSessions = true
    })
    try {
      const response = await this.sessionTransport.listSessions()
      runInAction(() => {
        this.chatsStore.sessions = response.sessions
        this.chatsStore.selectedSessionId = response.sessions[0]?.sessionId
      })
    } finally {
      runInAction(() => {
        this.chatsStore.isLoadingSessions = false
      })
    }
  }

  createSession(): void {
    const sessionId = crypto.randomUUID()
    runInAction(() => {
      this.chatsStore.sessions = [
        {
          sessionId,
          title: "Новый чат",
          stage: SessionStage.clarification,
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
