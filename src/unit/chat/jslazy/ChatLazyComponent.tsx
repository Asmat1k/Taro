import { lazy } from "react"

export const ChatLazyComponent = lazy(() =>
  import("../js").then((module) => ({ default: module.AuthGateComponent }))
)
