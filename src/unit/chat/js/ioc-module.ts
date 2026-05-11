import { ContainerModule } from "inversify"
import { ChatTransport$type, ChatTransportImpl, type ChatTransport } from "./transport"
import { type ChatService, ChatService$type, ChatServiceImpl } from "./service"
import { type ChatStore, ChatStore$type, chatStore } from "./store"

export const iocChatContainer = new ContainerModule(({ bind }) => {
  bind<ChatTransport>(ChatTransport$type).to(ChatTransportImpl).inSingletonScope()

  bind<ChatService>(ChatService$type).to(ChatServiceImpl).inSingletonScope()

  bind<ChatStore>(ChatStore$type).toConstantValue(chatStore)
})
