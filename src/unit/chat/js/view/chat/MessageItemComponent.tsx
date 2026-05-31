import "./MessageItemComponent.scss"
import { observer } from "mobx-react-lite"
import ReactMarkdown from "react-markdown"
import { MessageRole, type ChatItemMessage } from "@common"

type Props = {
  item: ChatItemMessage
}

const AVATARS: Record<MessageRole, string> = {
  [MessageRole.USER]: "🧑",
  [MessageRole.ASSISTANT]: "🔮",
  [MessageRole.SYSTEM]: "⚙️",
}

export const MessageItemComponent = observer(function MessageItemComponent({ item }: Props) {
  const { role, content, streaming } = item
  const isEmpty = !content && streaming

  return (
    <div className={`message-item message-item--${role}`}>
      <div className="message-item__avatar">{AVATARS[role]}</div>

      <div
        className={[
          "message-item__bubble",
          streaming && content ? "message-item__streaming-cursor" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isEmpty ? (
          <div className="message-item__streaming-dots">
            <span />
            <span />
            <span />
          </div>
        ) : role === MessageRole.ASSISTANT ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          content
        )}
      </div>
    </div>
  )
})
