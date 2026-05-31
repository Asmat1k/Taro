import type { CardMessage, SessionTheme, MessageRole } from "@common"

export interface ChatItemMessage {
  type: "message"
  id: string
  role: MessageRole
  content: string
  streaming: boolean
}

export interface ChatItemCards {
  type: "cards"
  id: string
  cards: Array<CardMessage>
}

export interface ChatItemTheme {
  type: "theme"
  id: string
  theme: SessionTheme
}

export type ChatItem = ChatItemMessage | ChatItemCards | ChatItemTheme
