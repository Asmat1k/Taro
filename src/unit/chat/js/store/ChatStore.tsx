import { observable } from "mobx"
import type { Post } from "../model"

/*
* Этот стор - пример, никакой логики он не несет
*/

export const ChatStore$type = Symbol("ChatStore")

export interface ChatStore {
  post: Post | undefined
  count: number
}

export const chatStore = observable<ChatStore>({
  post: undefined,
  count: 0,
})
