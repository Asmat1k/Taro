import { fetchEventSource } from "@microsoft/fetch-event-source"
import { inject, injectable } from "inversify"
import { type ApiRequest, type ApiStreamRequest, type ApiStreamHandlers } from "../model"
import { ApiRequestService$type, ApiResponseService$type, type ApiRequestService, type ApiResponseService } from "../service"
import { CoreTransportNetworkError } from "./CoreTransportError"

export const CoreTransport$type = Symbol("CoreTransport")

export interface CoreTransport {
  request<TBody, TResponse>(req: ApiRequest<TBody, TResponse>): Promise<TResponse>

  stream(req: ApiStreamRequest, handlers: ApiStreamHandlers): AbortController
}

@injectable()
export class CoreTransportImpl implements CoreTransport {
  
 async request<TBody, TResponse>(req: ApiRequest<TBody, TResponse>): Promise<TResponse> {
    try {
      const url = this.apiRequestService.buildUrl(req.url)
      const headers = this.apiRequestService.buildHeaders(req.headers)
      const response = await fetch(url, {
        method: req.method,
        headers,
        body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
        signal: req.signal,
      })
      if (!response.ok) {
        await this.apiResponseService.handleInvalid(response)
      }
      if (response.status === 204) {
        return this.apiResponseService.parse(undefined, req.responseSchema)
      }
      const raw = await response.json()
      return this.apiResponseService.parse(raw, req.responseSchema)
    } catch (cause) {
      throw new CoreTransportNetworkError(cause)
    }
  }
 
  stream(req: ApiStreamRequest, handlers: ApiStreamHandlers): AbortController {
    const url = this.apiRequestService.buildUrl(req.url)
    const headers = this.apiRequestService.buildHeaders(req.headers)

    const controller = new AbortController()
    const { apiResponseService } = this
    
    void fetchEventSource(url, {
      method: "GET",
      headers,
      signal: controller.signal,
 
      async onopen(response) {
        if (!response.ok) {
          await apiResponseService.handleInvalid(response)
        }
        handlers.onOpen?.()
      },
 
      onmessage(ev) {
        handlers.onEvent(ev.event, ev.data, ev.id ?? null)
      },
 
      onclose() {
        handlers.onClose?.()
      },
 
      onerror(error) {
        handlers.onError?.(
          error instanceof Error ? error : new Error(String(error)),
        )
        throw error
      },
    })
 
    return controller
  }

  constructor(
    @inject(ApiRequestService$type) private apiRequestService: ApiRequestService,
    @inject(ApiResponseService$type) private apiResponseService: ApiResponseService
  ) {
  }
}
