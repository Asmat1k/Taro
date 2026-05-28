import { z } from "zod"
import { CardTheme } from "./CardTheme"

export type UserInfo = {
  name: string
  description?: string
  cardTheme?: CardTheme //TODO переименовать поле, как будет согласовано с бэком
}

export const UserInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  cardTheme: z.nativeEnum(CardTheme).optional(),
})
