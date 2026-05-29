import type z from "zod"
import { injectable } from "inversify"
import { ApiErrorSchema } from "../model"
import { CoreTransportError, CoreTransportNetworkError } from "../model"
import { nullToUndefined } from "./nullToUndefined"

export const ApiResponseService$type = Symbol("ApiResponseService")

export interface ApiResponseService {
  parse<T>(raw: unknown, schema: z.ZodType<T>): T

  handleInvalid(response: Response): Promise<never>
}

@injectable()
export class ApiResponseServiceImpl implements ApiResponseService {
 
  parse<T>(raw: unknown, schema: z.ZodType<T>): T {
    return schema.parse(nullToUndefined(raw))
  }

  async handleInvalid(response: Response): Promise<never> {
    const raw = await response.json()
    const parsed = ApiErrorSchema.safeParse(raw)
    if (!parsed.success) {
      throw new CoreTransportNetworkError(
        new Error(`HTTP ${response.status}: unexpected error shape or unable to parse it`),
      )
    }
    throw new CoreTransportError(response.status, parsed.data)
  }

  constructor() {}
}
