import type { Bind, BindToFluentSyntax, IsBound, RebindSync, ServiceIdentifier } from "inversify"

export function safeBind<T>(
  bind: Bind,
  rebind: RebindSync,
  isBound: IsBound,
) {
  return (token: ServiceIdentifier<T>): BindToFluentSyntax<T> =>
    isBound(token)
      ? rebind<T>(token)
      : bind<T>(token)
}
