import { ContainerModule } from "inversify"
import { type ChatsService, ChatsService$type, ChatsServiceImpl } from "./service"
import { type ChatsStore, ChatsStore$type, chatsStore } from "./store"

export const iocChatContainer = new ContainerModule(({ bind }) => {
  bind<ChatsService>(ChatsService$type).to(ChatsServiceImpl).inSingletonScope()

  bind<ChatsStore>(ChatsStore$type).toConstantValue(chatsStore)
})
