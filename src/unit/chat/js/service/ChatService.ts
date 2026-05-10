import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { CoreTranasport$type, type CoreTranasport } from "@common"
import { type ChatStore, ChatStore$type } from "../store"
import { PostSchema, type Post } from "../model"

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
      const post = await this.transport.request({
        url: "https://jsonplaceholder.typicode.com/posts/1",
        method: "GET",
        responseSchema: PostSchema
      })
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
    @inject(CoreTranasport$type) private transport: CoreTranasport
  ) {
  }
}
