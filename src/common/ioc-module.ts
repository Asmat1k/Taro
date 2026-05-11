import { ContainerModule } from "inversify"
import { ApiRequestService$type, ApiRequestServiceImpl, ApiResponseService$type, ApiResponseServiceImpl, type ApiRequestService, type ApiResponseService } from "./service"
import { CoreTranasport$type, CoreTranasportImpl, type CoreTranasport } from "./transport/CoreTransport"

export const iocCommonContainer = new ContainerModule(({ bind }) => {
  bind<CoreTranasport>(CoreTranasport$type).to(CoreTranasportImpl).inSingletonScope()

  bind<ApiRequestService>(ApiRequestService$type).to(ApiRequestServiceImpl).inSingletonScope()
  bind<ApiResponseService>(ApiResponseService$type).to(ApiResponseServiceImpl).inSingletonScope()
})
