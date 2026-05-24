import { ContainerModule } from "inversify"
import { ApiRequestService$type, ApiRequestServiceImpl, ApiResponseService$type, ApiResponseServiceImpl, type ApiRequestService, type ApiResponseService } from "./service"
import { CoreTransport$type, CoreTransportImpl, type CoreTransport, type SessionTransport, SessionTransport$type, SessionTransportImpl, type UserTransport, UserTransport$type, UserTransportImpl  } from "./transport"

export const iocCommonContainer = new ContainerModule(({ bind }) => {

  bind<CoreTransport>(CoreTransport$type).to(CoreTransportImpl).inSingletonScope()
  bind<SessionTransport>(SessionTransport$type).to(SessionTransportImpl).inSingletonScope()
  bind<UserTransport>(UserTransport$type).to(UserTransportImpl).inSingletonScope()

  bind<ApiRequestService>(ApiRequestService$type).to(ApiRequestServiceImpl).inSingletonScope()
  bind<ApiResponseService>(ApiResponseService$type).to(ApiResponseServiceImpl).inSingletonScope()
})
