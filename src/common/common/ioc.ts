import { Container } from "inversify"
import { iocCommonContainer } from "./ioc-module"

export const commonContainer = new Container({})
commonContainer.load(iocCommonContainer)

export function useCommonIoCBinding<T>(identifier: symbol): T {
  return commonContainer.get<T>(identifier)
}
