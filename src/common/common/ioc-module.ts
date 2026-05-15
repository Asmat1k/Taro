import { ContainerModule, type ServiceIdentifier } from "inversify"
import { ApiRequestService$type, ApiRequestServiceImpl, ApiResponseService$type, ApiResponseServiceImpl, type ApiRequestService, type ApiResponseService } from "./service"
import { CoreTransport$type, CoreTransportImpl, type CoreTransport, type SessionTransport, SessionTransport$type, SessionTransportImpl  } from "./transport"
import { safeBind } from "./utils/ioc/safeBind"

export const iocCommonContainer = new ContainerModule(({ bind, rebind, isBound }) => {
  const _bind = <T>(token: ServiceIdentifier<T>) => safeBind<T>(bind, rebind, isBound)(token)

  _bind<CoreTransport>(CoreTransport$type).to(CoreTransportImpl).inSingletonScope()
  _bind<SessionTransport>(SessionTransport$type).to(SessionTransportImpl).inSingletonScope()

  _bind<ApiRequestService>(ApiRequestService$type).to(ApiRequestServiceImpl).inSingletonScope()
  _bind<ApiResponseService>(ApiResponseService$type).to(ApiResponseServiceImpl).inSingletonScope()
})
