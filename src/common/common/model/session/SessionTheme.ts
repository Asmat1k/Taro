import { z } from "zod"

export enum SessionTheme {
  CAREER = "career",
  LOVE = "love",
  SELF = "self",
  SOCIAL = "social",
  OTHER = "other",
  HEALTH = "health",
}

export const SessionThemeSchema = z.nativeEnum(SessionTheme)
