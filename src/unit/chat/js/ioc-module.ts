import { ContainerModule, type ServiceIdentifier } from "inversify"
import { type ChatsService, ChatsService$type, ChatsServiceImpl } from "./service"
import { type ChatsStore, ChatsStore$type, chatsStore } from "./store"
import { safeBind } from "@common"

export const iocChatContainer = new ContainerModule(({ bind, rebind, isBound }) => {
  const _bind = <T>(token: ServiceIdentifier<T>) => safeBind<T>(bind, rebind, isBound)(token)

  _bind<ChatsService>(ChatsService$type).to(ChatsServiceImpl).inSingletonScope()

  _bind<ChatsStore>(ChatsStore$type).toConstantValue(chatsStore)
})
