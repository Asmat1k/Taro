import { runInAction } from "mobx"
import { inject, injectable } from "inversify"
import { makeLogger, UserTransport$type, type UserInfo, type UserTransport } from "@common"
import { UserStore$type, type UserStore } from "../store"

export const UserService$type = Symbol("UserService")

export interface UserService {
  getUser(): Promise<UserInfo>
}

@injectable()
export class UserServiceImpl implements UserService {

  async getUser(): Promise<UserInfo> {
    this.log.info("Get user")
    try {
        runInAction(() => {
        this.userStore.isLoadingUser = true
        })
      const user = await this.userTransport.getUser()
       runInAction(() => {
            this.userStore.isLoadingUser = false
    })
      this.log.info("Get user | done")
      return user
    } catch (error) {
      this.log.error("Get user | failed | error={}", error)

      throw error
    }
  }

  constructor(
    @inject(UserTransport$type) private userTransport: UserTransport,
    @inject(UserStore$type) private userStore: UserStore,
) {
  }

  private readonly log = makeLogger("chat.user")
}
