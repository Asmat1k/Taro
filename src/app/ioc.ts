import { Container } from "inversify"

export const iocContainer = new Container({})

export function useIoCBinding<T>(identifier: symbol): T {
  return iocContainer.get<T>(identifier)
}
