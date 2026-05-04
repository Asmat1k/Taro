import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { type ChatStore, ChatStore$type } from "../store"

/*
* Этот сервис - пример, никакой логики он не несет
*/

export const ChatService$type = Symbol("ChatService")

export interface ChatService {
  increment(): void

  decrement(): void
}

@injectable()
export class ChatServiceImpl implements ChatService {
  increment(): void {
    console.log("Increment")
    runInAction(() => {
      this.chatStore.count += 1
    })
  }

  decrement(): void {
    console.log("Decrement")
    runInAction(() => {
      this.chatStore.count -= 1
    })
  }

  constructor(
    @inject(ChatStore$type) private chatStore: ChatStore
  ) {
  }
}
