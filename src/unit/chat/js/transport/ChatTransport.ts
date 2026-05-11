import { inject, injectable } from "inversify"
import { CoreTranasport$type, type CoreTranasport } from "@common"
import { PostSchema, type Post } from "../model"

/*
* Этот транспорт - пример, никакой логики он не несет
*/

export const ChatTransport$type = Symbol("ChatTransport")

export interface ChatTransport {
  getById(id: number): Promise<Post>
}

@injectable()
export class ChatTransportImpl implements ChatTransport {

  async getById(id: number): Promise<Post> {
    const post = await this.transport.request({
      url: `https://jsonplaceholder.typicode.com/posts/${id}`,
      method: "GET",
      responseSchema: PostSchema
    })
    return post
  }

  constructor(
    @inject(CoreTranasport$type) private transport: CoreTranasport
  ) {
  }
}
