import { Container } from "inversify"

export const iocСommonContainer = new Container({})

export function useCommonIoCBinding<T>(identifier: symbol): T {
  return iocСommonContainer.get<T>(identifier)
}
