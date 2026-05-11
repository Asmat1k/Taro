import { ContainerModule } from "inversify"
import { type SessionTransport, SessionTransport$type, SessionTransportImpl } from "./transport"

export const iocCommonContainer = new ContainerModule(({ bind }) => {
  bind<SessionTransport>(SessionTransport$type).to(SessionTransportImpl).inSingletonScope()
})
