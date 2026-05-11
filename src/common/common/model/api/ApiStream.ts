export interface ApiStreamRequest {
  url: string
  headers?: Record<string, string>
}

export interface ApiStreamHandlers {
  onEvent(event: string, data: string, id: string | null): void
  
  onError?(error: Error): void
  
  onOpen?(): void
  
  onClose?(): void
}
