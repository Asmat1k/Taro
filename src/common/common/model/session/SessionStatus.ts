import { z } from "zod"

export enum SessionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  FAILED = "failed",
}

export const SessionStatusSchema = z.nativeEnum(SessionStatus)
