import { injectable } from "inversify"
import { type UserInfo, UserInfoSchema } from "../model"

export const UserTransport$type = Symbol("UserTransport")

export interface UserTransport {
  getUser(): Promise<UserInfo>
}

@injectable()
export class UserTransportImpl implements UserTransport {

  async getUser(): Promise<UserInfo> {
    // GET /user
    // headers:
    // X-Real-IP: string (required)
    //
    // Success 200:
    // {
    //   name: string,
    //   description?: string,
    // }
    //
    // Errors:
    // 401 Unauthorized (typed structure)
    // 500 Exception (typed structure)

    const raw = {
      name: "Иван Петров",
      description: "Frontend developer. Работаю с React и TypeScript.",
    }

    return UserInfoSchema.parse(raw)
  }

  constructor(
  ) {
    }
}
