import { inject, injectable } from "inversify"
import { z } from "zod"
import { type UserInfo, UserInfoSchema } from "../model"
import { CoreTransport$type, type CoreTransport } from "./CoreTransport"

export const UserTransport$type = Symbol("UserTransport")

export interface UserTransport {
  getUser(): Promise<UserInfo | null>

  createUser(name: string, description?: string): Promise<void>

  updateUser(name?: string, description?: string): Promise<UserInfo>
}

@injectable()
export class UserTransportImpl implements UserTransport {

  async getUser(): Promise<UserInfo | null> {
    return await this.coreTransport.request({
      url: "/user",
      method: "GET",
      responseSchema: UserInfoSchema,
    })
  }

  async createUser(name: string, description?: string): Promise<void> {
    await this.coreTransport.request({
      url: "/user",
      method: "POST",
      body: { name, description },
      responseSchema: z.undefined(),
    })
  }

  async updateUser(name?: string, description?: string): Promise<UserInfo> {
    return this.coreTransport.request({
      url: "/user",
      method: "PATCH",
      body: { name, description },
      responseSchema: UserInfoSchema,
    })
  }

  constructor(
    @inject(CoreTransport$type) private coreTransport: CoreTransport,
  ) {
  }
}
