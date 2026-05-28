import { z } from "zod"

export enum SessionStage {
  PREDICTION = "prediction",
  CLARIFICATION = "clarification",
}

export const SessionStageSchema = z.nativeEnum(SessionStage)
