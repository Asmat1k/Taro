import { Container } from "inversify"
import { iocCommonContainer } from "./ioc-module"

export const commonContainer = new Container({})

if (!iocCommonContainer.id) {
  commonContainer.load(iocCommonContainer)
}

export function useCommonIoCBinding<T>(identifier: symbol): T {
  return commonContainer.get<T>(identifier)
}
