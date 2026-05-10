import { injectable } from "inversify"

export const ApiRequestService$type = Symbol("ApiRequestService")

export interface ApiRequestService {
  buildUrl(path: string): string

  buildHeaders(extra?: Record<string, string>): Record<string, string>
}

@injectable()
export class ApiRequestServiceImpl implements ApiRequestService {

  buildUrl(path: string): string {
    /*
    * TODO
    * Временный костыль - так как не понятно куда будут запросы
    */
    // eslint-disable-next-line no-constant-condition
    if (true) {
      return path
    }
    const base = this.BASE_URL.replace(/\/$/, "")
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${base}${normalizedPath}`
  }
 
  buildHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    }
  }

  constructor() {
  }

  private readonly BASE_URL: string = "/" // TODO - узнать куда будут запросы
}
