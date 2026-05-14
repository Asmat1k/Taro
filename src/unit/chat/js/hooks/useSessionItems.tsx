import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { UnorderedListOutlined } from "@ant-design/icons"
import { type ConversationsProps } from "@ant-design/x"
import { chatsStore } from "../store"

export const useSessionItems = (collapsed: boolean): ConversationsProps["items"] => {
  const { t } = useTranslation()

  return useMemo(() => {
    return chatsStore.sessions.map((session) => {
      const shortId = session.sessionId.slice(0, 8)

      const displayTitle =
        session.title ?? t("chat.sessionFallback", { shortId })

      return {
        key: session.sessionId,
        label: collapsed ? null : displayTitle,
        icon: <UnorderedListOutlined />,
      }
    })
  }, [ collapsed, t ])
}
