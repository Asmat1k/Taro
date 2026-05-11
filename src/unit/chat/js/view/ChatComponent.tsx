import "./ChatComponent.scss"
import { useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Empty, Skeleton } from "antd"
import { MenuFoldOutlined, UnorderedListOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Conversations, type ConversationsProps } from "@ant-design/x"
import { type ChatsService, ChatsService$type } from "../service"
import { useIoCBinding } from "../ioc"
import { chatsStore } from "../store"

export const ChatComponent = observer(function ChatComponent() {
  const chatsService = useIoCBinding<ChatsService>(ChatsService$type)
  const { t } = useTranslation()
  const [ collapsed, setCollapsed ] = useState(false)

  useEffect(() => {
    void chatsService.loadSessions()
  }, [ chatsService ])

  const onCreate = useCallback(() => {
    void chatsService.createSession()
  }, [ chatsService ])

  const sessionItems: ConversationsProps["items"] = chatsStore.sessions.map((session) => {
    const shortId = session.sessionId.slice(0, 8)
    const displayTitle =
      session.title ?? t("chat.sessionFallback", { shortId })
    return {
      key: session.sessionId,
      label: collapsed ? null : displayTitle,
      icon: <UnorderedListOutlined />,
    }
  })

  return (
    <div className="chat-sidebar-page">
      <aside
        className={`chat-sidebar ${collapsed ? "chat-sidebar--collapsed" : ""}`}
      >
        <Button
          className="chat-sidebar__collapse-btn"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {!collapsed && t("chat.collapse")}
        </Button>
        <Button
          className="chat-sidebar__new-chat-btn"
          type="primary"
          onClick={onCreate}
        >
          {collapsed ? "+" : t("chat.newChat")}
        </Button>
        <div className="chat-sidebar__content">
          {chatsStore.isLoadingSessions ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : sessionItems.length === 0 ? (
            <Empty
              className="chat-sidebar__empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={collapsed ? false : t("chat.noSessions")}
            />
          ) : (
            <Conversations
              className="p-0"
              items={sessionItems}
              activeKey={chatsStore.selectedSessionId}
              onActiveChange={(value) => chatsService.selectSession(value)}
            />
          )}
        </div>
      </aside>
    </div>
  )
})
