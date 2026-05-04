import { ContainerModule } from "inversify"
import { type ChatService, ChatService$type, ChatServiceImpl } from "./service"
import { type ChatStore, ChatStore$type, chatStore } from "./store"

export const iocChatContainer = new ContainerModule(({ bind }) => {
  bind<ChatService>(ChatService$type).to(ChatServiceImpl).inSingletonScope()

  bind<ChatStore>(ChatStore$type).toConstantValue(chatStore)
})
