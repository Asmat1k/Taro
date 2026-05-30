import "./ChatPanelComponent.scss"
import { useCallback, useEffect, useRef, type KeyboardEvent } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Input, Select, Skeleton } from "antd"
import { Welcome } from "@ant-design/x"
import { SendOutlined } from "@ant-design/icons"
import { MessageTone, type ChatItemCards, type ChatItemMessage, type ChatItemTheme } from "@common"
import { type SessionService, SessionService$type } from "../../service"
import { chatsStore, sessionStore } from "../../store"
import { useIoCBinding } from "../../ioc"
import { TarotCardComponent } from "./TarotCardComponent"
import { MessageItemComponent } from "./MessageItemComponent"

const TONE_OPTIONS = [
  { value: MessageTone.NEUTRAL, label: "chat.panel.tones.neutral" },
  { value: MessageTone.POSITIVE, label: "chat.panel.tones.positive" },
  { value: MessageTone.NEGATIVE, label: "chat.panel.tones.negative" },
]

const THEME_ICON: Record<string, string> = {
  career: "💼",
  love: "❤️",
  self: "🧘",
  social: "👥",
  health: "🌿",
  other: "✨",
}

export const ChatPanelComponent = observer(function ChatPanelComponent() {
  const { t } = useTranslation()
  const sessionService = useIoCBinding<SessionService>(SessionService$type)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputValueRef = useRef("")

  const selectedSessionId = chatsStore.selectedSessionId
  const isNewChat = selectedSessionId === undefined
  const { isLoadingSession, isStreaming, chatItems, selectedTone } = sessionStore

  useEffect(() => {
    if (selectedSessionId) {
      void sessionService.loadSession(selectedSessionId)
    } else {
      sessionService.clearSession()
    }
  }, [ selectedSessionId, sessionService ])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [ chatItems.length ])

  const onSend = useCallback(() => {
    const message = inputValueRef.current.trim()
    if (!message || isStreaming) return

    if (inputRef.current) {
      inputRef.current.value = ""
      inputValueRef.current = ""
    }

    void sessionService.sendMessage(message)
  }, [ isStreaming, sessionService ])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        onSend()
      }
    },
    [ onSend ],
  )

  const onToneChange = useCallback(
    (value: MessageTone) => {
      sessionService.setTone(value)
    },
    [ sessionService ],
  )

  const isInputDisabled =
    isStreaming ||
    (!isNewChat && isLoadingSession)

  const placeholder = isStreaming
    ? t("chat.panel.loadingPlaceholder")
    : isNewChat
      ? t("chat.panel.sendPlaceholder")
      : t("chat.panel.clarificationPlaceholder")

  const headerTitle = isNewChat
    ? t("chat.panel.newChatTitle")
    : chatsStore.sessions.find((s) => s.sessionId === selectedSessionId)?.title ??
      t("chat.panel.newChatTitle")

  const themeItem = chatItems.find((i): i is ChatItemTheme => i.type === "theme")

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <div className="chat-panel__header-title">{headerTitle}</div>
        {themeItem && (
          <span className="chat-panel__theme-badge">
            {THEME_ICON[themeItem.theme] ?? "✨"}{" "}
            {t(`chat.panel.themes.${themeItem.theme}`)}
          </span>
        )}
      </div>
      <div className="chat-panel__messages">
        {isLoadingSession && !isNewChat && (
          <Skeleton active paragraph={{ rows: 6 }} />
        )}

        {chatItems.length === 0 && !isLoadingSession && !isStreaming && (
          <div className="chat-panel__empty">
            <Welcome
              title={t("chat.panel.emptyTitle")}
              description={t("chat.panel.emptySessionDesc")}
            />
          </div>
        )}

        {chatItems.map((item) => {
          if (item.type === "theme") {
            const themeItem = item as ChatItemTheme
            return (
              <div key={themeItem.id} className="chat-panel__theme-row">
                <span className="chat-panel__theme-badge">
                  {THEME_ICON[themeItem.theme] ?? "✨"}{" "}
                  {t(`chat.panel.themes.${themeItem.theme}`)}
                </span>
              </div>
            )
          }

          if (item.type === "cards") {
            const cardsItem = item as ChatItemCards
            return (
              <div key={cardsItem.id} className="chat-panel__cards-row">
                {cardsItem.cards.map((card) => (
                  <TarotCardComponent key={card.cardId} card={card} />
                ))}
              </div>
            )
          }

          const msgItem = item as ChatItemMessage
          return <MessageItemComponent key={msgItem.id} item={msgItem} />
        })}

        <div ref={bottomRef} />
      </div>

      <div className="chat-panel__input-area">
        {isNewChat && (
          <div className="chat-panel__tone-row">
            <span className="chat-panel__tone-label">{t("chat.panel.toneLabel")}</span>
            <Select
              value={selectedTone}
              onChange={onToneChange}
              options={TONE_OPTIONS.map((o) => ({ value: o.value, label: t(o.label) }))}
              size="small"
              style={{ width: 150 }}
              disabled={isStreaming}
            />
          </div>
        )}

        <div className="chat-panel__input-row">
          <Input.TextArea
            ref={inputRef}
            className="chat-panel__textarea"
            placeholder={placeholder}
            disabled={isInputDisabled}
            onChange={(e) => { inputValueRef.current = e.target.value }}
            onKeyDown={onKeyDown}
            autoSize={{ minRows: 1, maxRows: 5 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={onSend}
            disabled={isInputDisabled}
            loading={isStreaming}
          />
        </div>
      </div>
    </div>
  )
})
