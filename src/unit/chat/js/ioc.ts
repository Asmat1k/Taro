import { Container } from "inversify"
import { commonContainer } from "@common"
import { iocChatContainer } from "./ioc-module"

export const iocContainer = new Container({
  parent: commonContainer,
})

if (!iocChatContainer.id) {
  iocContainer.load(iocChatContainer)
}

export function useIoCBinding<T>(identifier: symbol): T {
  return iocContainer.get<T>(identifier)
}
