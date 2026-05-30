import "./ChatComponent.scss"
import { useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Empty, Spin } from "antd"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import { Conversations } from "@ant-design/x"
import { ThemeService$type, type ThemeService } from "@common"
import { type ChatsService, ChatsService$type } from "../../service"
import { useSessionItems } from "../../hooks"
import { useIoCBinding } from "../../ioc"
import { chatsStore } from "../../store"
import { ChatPanelComponent } from "../chat/ChatPanelComponent"
import { SettingsModalComponent } from "../settings/SettingsModalComponent"

export const ChatComponent = observer(function ChatComponent() {
  const { t } = useTranslation()
  const chatsService = useIoCBinding<ChatsService>(ChatsService$type)
  const themeService = useIoCBinding<ThemeService>(ThemeService$type)
  const [ collapsed, setCollapsed ] = useState(false)
  const [ isSettingsOpened, setIsSettingsOpened ] = useState(false)
  const sessionItems = useSessionItems(collapsed)

  const isLoading = chatsStore.isLoadingSessions
  const isEmpty = !isLoading && sessionItems?.length === 0
  const hasSessions = !isLoading && sessionItems !== undefined && sessionItems.length > 0

  useEffect(() => {
    themeService.loadAndApplyTheme()
    void chatsService.loadSessions()
  }, [ chatsService, themeService ])

  const onCreate = useCallback(() => {
    void chatsService.createSession()
  }, [ chatsService ])

  const onActiveChange = useCallback((value: string) => {
    chatsService.selectSession(value)
  }, [ chatsService ])

  const onSetCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  const onOpenSettings = useCallback(() => {
    setIsSettingsOpened(true)
  }, [])

  const onCloseSettings = useCallback(() => {
    setIsSettingsOpened(false)
  }, [])

  return (
    <div className="chat-sidebar-page">
      <aside className={`chat-sidebar ${collapsed ? "chat-sidebar--collapsed" : ""}`}>
        <Button
          className="chat-sidebar__collapse-btn"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onSetCollapsed}
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
          {isLoading && (
            <div className="chat-sidebar__loader">
              <Spin size="large" />
            </div>
          )}

          {isEmpty && (
            <Empty
              className="chat-sidebar__empty"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={collapsed ? false : t("chat.noSessions")}
            />
          )}

          {hasSessions && (
            <Conversations
              className="p-0"
              items={sessionItems}
              activeKey={chatsStore.selectedSessionId}
              onActiveChange={onActiveChange}
            />
          )}
        </div>

        <div className="chat-sidebar__footer">
          <Button
            className="chat-sidebar__settings-btn"
            icon={<SettingOutlined />}
            onClick={onOpenSettings}
            block
          >
            {!collapsed && t("chat.settings")}
          </Button>
        </div>
      </aside>

      <ChatPanelComponent />

      <SettingsModalComponent
        open={isSettingsOpened}
        onClose={onCloseSettings}
      />
    </div>
  )
})
