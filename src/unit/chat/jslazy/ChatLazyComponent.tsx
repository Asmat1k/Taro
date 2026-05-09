import { lazy } from "react"
import { iocCommonContainer } from "@common"

export const ChatLazyComponent = lazy(() => {
  return import("../js").then((module) => {
    const { iocChatContainer, iocContainer, ChatComponent } = module
    iocContainer.load(iocCommonContainer)
    iocContainer.load(iocChatContainer)

    return { default: ChatComponent }
  })
})
