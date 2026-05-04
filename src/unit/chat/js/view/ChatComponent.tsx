import { observer } from "mobx-react-lite"
import { useIoCBinding } from "../ioc"
import { type ChatService, ChatService$type } from "../service"
import { chatStore } from "../store"
import { useBlocker, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Paths } from "@common"

export const ChatComponent = observer(function ChatComponent() {
  const chatService = useIoCBinding<ChatService>(ChatService$type)
  const navigation = useNavigate()
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === "blocked") {
      if (window.confirm("Are you sure?")) {
        blocker.proceed()
      }
    }
  }, [ blocker ])

  const onBack = () => {
    navigation(Paths.path)
  }
  
  const onIncrement = () => {
    chatService.increment()
  }

  const onDecrement = () => {
    chatService.decrement()
  }

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={onIncrement}>Increment</button>
      <div>{chatStore.count}</div>
      <button onClick={onDecrement}>Decrement</button>
      <button onClick={onBack}>Go back</button>
    </div>
  )
})
