import { runInAction } from "mobx"
import { inject, injectable } from "inversify"
import { makeLogger, UserTransport$type, type UserInfo, type UserTransport } from "@common"
import { UserStore$type, type UserStore } from "../store"

export const UserService$type = Symbol("UserService")

export interface UserService {
  getUser(): Promise<UserInfo | null>
  saveUser(name: string, description?: string, isRegistration?: boolean): Promise<void>
}

@injectable()
export class UserServiceImpl implements UserService {

  async getUser(): Promise<UserInfo | null> {
    this.log.info("Get user")
    runInAction(() => {
      this.userStore.isLoadingUser = true
    })
    try {
      const user = await this.userTransport.getUser()
      runInAction(() => {
        this.userStore.isLoadingUser = false
        this.userStore.user = user
        this.userStore.isAuthenticated = true
        this.userStore.isNewUser = false
      })
      this.log.info("Get user | done")
      return user
    } catch (error) {
      runInAction(() => {
        this.userStore.isLoadingUser = false
      })
      this.log.error("Get user | failed | error={}", error)
      throw error
    }
  }

  async saveUser(name: string, description?: string, isRegistration?: boolean): Promise<void> {
    this.log.info("Save user | isNew={}", isRegistration)
    runInAction(() => { this.userStore.isLoadingUser = true })
    try {
      if (isRegistration) {
        await this.userTransport.createUser(name, description)
        runInAction(() => { this.userStore.isNewUser = false })
      } else {
        await this.userTransport.updateUser(name, description)
      }
      runInAction(() => {
        this.userStore.isLoadingUser = false
        this.userStore.isAuthenticated = true
      })
      this.log.info("Save user | done")
    } catch (error) {
      runInAction(() => {
        this.userStore.isLoadingUser = false
      })
      this.log.error("Save user | failed | error={}", error)
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
