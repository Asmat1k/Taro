import { observable } from "mobx"

/*
* Этот стор - пример, никакой логики он не несет
*/

export const ChatStore$type = Symbol("ChatStore")

export interface ChatStore {
  count: number
}

export const chatStore = observable<ChatStore>({
  count: 0,
})
