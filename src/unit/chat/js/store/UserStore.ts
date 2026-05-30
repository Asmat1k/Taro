import { observable } from "mobx"
import { type UserInfo } from "@common"

export const UserStore$type = Symbol("UserStore")

export interface UserStore {
  isLoadingUser: boolean
  user: UserInfo | null
}

export const userStore = observable<UserStore>({
  isLoadingUser: false,
  user: null,
})
