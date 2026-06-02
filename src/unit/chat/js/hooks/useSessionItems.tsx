import { useTranslation } from "react-i18next"
import { UnorderedListOutlined } from "@ant-design/icons"
import { type ConversationsProps } from "@ant-design/x"
import { chatsStore } from "../store"

export const useSessionItems = (collapsed: boolean): ConversationsProps["items"] => {
  const { t } = useTranslation()

  return chatsStore.sessions.map((session) => {

    const displayTitle = session.title ?? t("chat.sessionFallback")

    return {
      key: session.sessionId,
      label: collapsed ? null : displayTitle,
      icon: <UnorderedListOutlined />,
    }
  })
}
