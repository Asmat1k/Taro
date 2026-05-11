
import type z from "zod"

export interface ApiRequest<TBody, TResponse> {
  url: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: TBody
  headers?: Record<string, string>
  responseSchema: z.ZodType<TResponse>
  signal?: AbortSignal
}
