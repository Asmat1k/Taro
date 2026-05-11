import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { type ChatStore, ChatStore$type } from "../store"
import { ChatTransport$type, type ChatTransport } from "../transport"

/*
* Этот сервис - пример, никакой логики он не несет
*/

export const ChatService$type = Symbol("ChatService")

export interface ChatService {
  getPost(): Promise<void>

  increment(): void

  decrement(): void
}

@injectable()
export class ChatServiceImpl implements ChatService {

  async getPost(): Promise<void> {
    try {
      const post = await this.chatTransport.getById(1)
      runInAction(() => {
        this.chatStore.post = post
      })
    } catch(e) {
      throw Error(`Error white fetching ${e}`)
    }
  }

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
    @inject(ChatStore$type) private chatStore: ChatStore,
    @inject(ChatTransport$type) private chatTransport: ChatTransport
  ) {
  }
}
