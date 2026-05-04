import { lazy } from "react"

export const ChatLazyComponent = lazy(() => {
  return import("../js").then((module) => {
    const { iocChatContainer, iocContainer, ChatComponent } = module
    iocContainer.load(iocChatContainer)

    return { default: ChatComponent }
  })
})
