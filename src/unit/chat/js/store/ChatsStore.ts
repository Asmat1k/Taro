import { observable } from "mobx"
import { type Session } from "@common"

export const ChatsStore$type = Symbol("ChatsStore")

export interface ChatsStore {
  sessions: Array<Session>
  selectedSessionId?: string
  isLoadingSessions: boolean
}

export const chatsStore = observable<ChatsStore>({
  sessions: [],
  selectedSessionId: undefined,
  isLoadingSessions: false,
})
