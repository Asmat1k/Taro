import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import {
  SessionTransport$type,
  type SessionTransport,
  makeLogger,
} from "@common"
import { type ChatsStore, ChatsStore$type } from "../store"

export const ChatsService$type = Symbol("ChatsService")

export interface ChatsService {
  loadSessions(): Promise<void>
  createSession(): void
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

  createSession(): void {
    this.log.info("Create session | waiting for user input")
    runInAction(() => {
      this.chatsStore.selectedSessionId = undefined
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
