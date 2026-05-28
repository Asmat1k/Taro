import { ContainerModule } from "inversify"
import {
  ApiRequestService$type, 
  ApiRequestServiceImpl,
  ApiResponseService$type, 
  ApiResponseServiceImpl,
  type ApiRequestService, 
  type ApiResponseService,
  ThemeService$type, 
  ThemeServiceImpl, 
  type ThemeService,
} from "./service"
import { CoreTransport$type, CoreTransportImpl, type CoreTransport, type SessionTransport, SessionTransport$type, SessionTransportImpl, type UserTransport, UserTransport$type, UserTransportImpl  } from "./transport"
import { ThemeStore$type, themeStore, type ThemeStore } from "./store"

export const iocCommonContainer = new ContainerModule(({ bind }) => {

  bind<CoreTransport>(CoreTransport$type).to(CoreTransportImpl).inSingletonScope()
  bind<SessionTransport>(SessionTransport$type).to(SessionTransportImpl).inSingletonScope()
  bind<UserTransport>(UserTransport$type).to(UserTransportImpl).inSingletonScope()

  bind<ApiRequestService>(ApiRequestService$type).to(ApiRequestServiceImpl).inSingletonScope()
  bind<ApiResponseService>(ApiResponseService$type).to(ApiResponseServiceImpl).inSingletonScope()
  bind<ThemeService>(ThemeService$type).to(ThemeServiceImpl).inSingletonScope()

  bind<ThemeStore>(ThemeStore$type).toConstantValue(themeStore)
})
