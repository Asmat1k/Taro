import { ContainerModule } from "inversify"
import {
  type ChatsService,
  ChatsService$type,
  ChatsServiceImpl,
  type SessionService,
  SessionService$type,
  SessionServiceImpl,
  type UserService,
  UserService$type,
  UserServiceImpl,
} from "./service"
import {
  type ChatsStore,
  ChatsStore$type,
  type UserStore,
  UserStore$type,
  chatsStore,
  userStore,
  type SessionStore,
  SessionStore$type,
  sessionStore,
} from "./store"

export const iocChatContainer = new ContainerModule(({ bind }) => {
  bind<ChatsService>(ChatsService$type).to(ChatsServiceImpl).inSingletonScope()
  bind<SessionService>(SessionService$type).to(SessionServiceImpl).inSingletonScope()
  bind<UserService>(UserService$type).to(UserServiceImpl).inSingletonScope()

  bind<ChatsStore>(ChatsStore$type).toConstantValue(chatsStore)
  bind<UserStore>(UserStore$type).toConstantValue(userStore)
  bind<SessionStore>(SessionStore$type).toConstantValue(sessionStore)
})
