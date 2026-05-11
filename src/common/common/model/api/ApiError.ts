import { z } from "zod"
import { ErrorName } from "../error/ErrorName"
 
export interface ApiError {
  serviceName: string,
  errorCode: ErrorName,
  userMessage: string,
  developerMessage: string,
}

export const ApiErrorSchema: z.ZodType<ApiError> = z.object({
  serviceName: z.string(),
  errorCode: z.enum(ErrorName),
  userMessage: z.string(),
  developerMessage: z.string(),
})
