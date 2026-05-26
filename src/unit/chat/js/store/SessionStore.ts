import { observable } from "mobx"
import { type MessageTone, MessageTone as MessageToneEnum } from "@common"
import { type ChatItem } from "../../../../common/common/model/chat"

export const SessionStore$type = Symbol("SessionStore")

export interface SessionStore {
  isLoadingSession: boolean
  isStreaming: boolean
  selectedTone: MessageTone
  chatItems: Array<ChatItem>
}

export const sessionStore = observable<SessionStore>({
  isLoadingSession: false,
  isStreaming: false,
  selectedTone: MessageToneEnum.NEUTRAL,
  chatItems: [],
})
