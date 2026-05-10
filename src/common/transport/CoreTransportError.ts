import type { ApiError } from "../model/api/ApiError"

export class CoreTransportError extends Error {
  constructor(statusCode: number, payload: ApiError) {
    super(payload.userMessage)
    this.name = "Core Transport Error"
    this.statusCode = statusCode
    this.payload = payload
  }

  public readonly statusCode: number
  public readonly payload: ApiError
}
 
export class CoreTransportNetworkError extends Error {
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : "Network Error")
    this.name = "Core Network Error"
    this.cause = cause
  }
}
