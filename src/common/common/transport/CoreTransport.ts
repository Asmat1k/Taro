import { fetchEventSource } from "@microsoft/fetch-event-source"
import { inject, injectable } from "inversify"
import { type ApiRequest, type ApiStreamRequest, type ApiStreamHandlers } from "../model"
import { ApiRequestService$type, ApiResponseService$type, type ApiRequestService, type ApiResponseService } from "../service"
import { CoreTransportNetworkError } from "./CoreTransportError"
import { makeLogger } from "../core"

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
      const rawRequest = req.body !== undefined ? JSON.stringify(req.body) : undefined
      this.log.info("[HTTP] request {} {}", req.method, req.url)
      this.log.debug("[HTTP] request {} {} (headers:{}) (body:{})", req.method, req.url, req.headers, rawRequest)
      const response = await fetch(url, {
        method: req.method,
        headers,
        body: rawRequest,
        signal: req.signal,
      })
      if (!response.ok) {
        await this.apiResponseService.handleInvalid(response)
      }
      if (response.status === 204) {
        return this.apiResponseService.parse(undefined, req.responseSchema)
      }
      const raw = await response.json()
      this.log.info("[HTTP] response {} {} {}", req.method, req.url, response.status)
      this.log.debug("[HTTP] response {} {} {} (headers:{}) (body:{})", req.method, req.url, response.status, response.headers, raw)
      return this.apiResponseService.parse(raw, req.responseSchema)
    } catch (cause) {
      this.log.error("[HTTP] request {} {} | failed", req.method, req.url, cause)
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

  protected readonly log = makeLogger("taro.api.core")
}
