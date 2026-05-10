import type { ApiError } from "../model/api/ApiError"

export class CoreTransportError extends Error {
  constructor(statusCode: number, payload: ApiError) {
    super(payload.userMessage)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.payload = payload
  }

  public readonly statusCode: number
  public readonly payload: ApiError
}
 
export class CoreTransportNetworkError extends Error {
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : "Network error")
    this.name = "ApiNetworkError"
    this.cause = cause
  }
}
