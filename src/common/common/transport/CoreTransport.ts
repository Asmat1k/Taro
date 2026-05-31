import { fetchEventSource } from "@microsoft/fetch-event-source"
import { inject, injectable } from "inversify"
import { type ApiRequest, type ApiStreamRequest, type ApiStreamHandlers, CoreTransportNetworkError } from "../model"
import { ApiResponseService$type, type ApiResponseService, ApiRequestService$type, type ApiRequestService } from "../service"
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
      const text = await response.text()
      if (!text) {
        return this.apiResponseService.parse(undefined, req.responseSchema)
      }
      const raw = JSON.parse(text)
      this.log.info("[HTTP] response {} {} {}", req.method, req.url, response.status)
      this.log.debug("[HTTP] response {} {} {} (headers:{}) (body:{})", req.method, req.url, response.status, response.headers, JSON.stringify(raw))
      return this.apiResponseService.parse(raw, req.responseSchema)
    } catch (cause) {
      this.log.error("[HTTP] request {} {} | failed", req.method, req.url, cause)
      throw new CoreTransportNetworkError(cause)
    }
  }
 
  stream(req: ApiStreamRequest, handlers: ApiStreamHandlers): AbortController {
    const url = this.apiRequestService.buildUrl(req.url)
    const headers = this.apiRequestService.buildHeaders(req.headers)

    this.log.info("[HTTP] stream connect GET {}", req.url)
    this.log.debug("[HTTP] stream connect GET {} (headers:{})", req.url, req.headers)

    const controller = new AbortController()
    const { apiResponseService, log } = this
    
    void fetchEventSource(url, {
      method: "GET",
      headers,
      signal: controller.signal,
 
      async onopen(response) {
        if (!response.ok) {
          await apiResponseService.handleInvalid(response)
        }
        log.info("[HTTP] stream open GET {} {}", req.url, response.status)
        log.debug("[HTTP] stream open GET {} {} (headers:{})", req.url, response.status, response.headers)
        handlers.onOpen?.()
      },
 
      onmessage(ev) {
        log.debug("[HTTP] stream event GET {} (event:{}) (id:{}) (data:{})", req.url, ev.event, ev.id, ev.data)
        handlers.onEvent(ev.event, ev.data, ev.id ?? null)
      },
 
      onclose() {
        log.info("[HTTP] stream closed GET {}", req.url)
        controller.abort()
        handlers.onClose?.()
      },
 
      onerror(error) {
        log.error("[HTTP] stream failed GET {}", req.url, error)
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
