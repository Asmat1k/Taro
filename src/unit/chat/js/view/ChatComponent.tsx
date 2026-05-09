import "./ChatComponent.scss"
import { useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Button, Empty, Skeleton } from "antd"
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Conversations, type ConversationsProps } from "@ant-design/x"
import { type ChatsService, ChatsService$type } from "../service"
import { useIoCBinding } from "../ioc"
import { chatsStore } from "../store"

export const ChatComponent = observer(function ChatComponent() {
  const chatsService = useIoCBinding<ChatsService>(ChatsService$type)
  const [ collapsed, setCollapsed ] = useState(false)

  useEffect(() => {
    void chatsService.loadSessions()
  }, [ chatsService ])

  const onCreate = useCallback(() => {
    chatsService.createSession()
  }, [ chatsService ])

  const sessionItems: ConversationsProps["items"] = chatsStore.sessions.map((session) => ({
    key: session.sessionId,
    label: collapsed
      ? toCollapsedLabel(session.title ?? `Сессия ${session.sessionId.slice(0, 8)}`)
      : (session.title ?? `Сессия ${session.sessionId.slice(0, 8)}`),
  }))

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
          {!collapsed && "Свернуть"}
        </Button>
        <Button
          className="chat-sidebar__new-chat-btn"
          type="primary"
          onClick={onCreate}
        >
          {collapsed ? "+" : "Новый чат"}
        </Button>
        <div className="chat-sidebar__content">
          {chatsStore.isLoadingSessions ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : sessionItems.length === 0 ? (
            <Empty
              className="chat-sidebar__empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={collapsed ? false : "Сессий пока нет"}
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

function toCollapsedLabel(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) {
    return "?"
  }

  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "")
  return initials.join("")
}
