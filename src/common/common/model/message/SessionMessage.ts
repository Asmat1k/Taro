import { z } from "zod"
import { MessageRole, MessageRoleSchema } from "./MessageRole"

export type CardArcana = "major" | "minor"

export interface TextMessage {
  objectType: "message"
  role: MessageRole
  content: string
}

export interface CardMessage {
  objectType: "card"
  cardId: number
  title: string
  meaning: string
  arcana: CardArcana
  reversed: boolean
}

export type SessionMessage = TextMessage | CardMessage

export const CardArcanaSchema = z.enum([ "major", "minor" ])

export const TextMessageSchema = z.object({
  objectType: z.literal("message"),
  role: MessageRoleSchema,
  content: z.string(),
})

export const CardMessageSchema = z.object({
  objectType: z.literal("card"),
  cardId: z.number(),
  title: z.string(),
  meaning: z.string(),
  arcana: CardArcanaSchema,
  reversed: z.boolean(),
})

export const SessionMessageSchema = z.discriminatedUnion("objectType", [
  TextMessageSchema,
  CardMessageSchema,
])
