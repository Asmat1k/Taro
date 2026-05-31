import { z } from "zod"

export type UserInfo = {
  name: string
  description?: string
}

export const UserInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})
