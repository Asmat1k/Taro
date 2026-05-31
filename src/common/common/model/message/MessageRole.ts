import { z } from "zod"

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export const MessageRoleSchema = z.nativeEnum(MessageRole)
