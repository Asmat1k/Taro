import { iocCommonContainer } from "@common"
import { Container } from "inversify"

export const iocContainer = new Container({})
iocContainer.load(iocCommonContainer)

export function useIoCBinding<T>(identifier: symbol): T {
  return iocContainer.get<T>(identifier)
}
