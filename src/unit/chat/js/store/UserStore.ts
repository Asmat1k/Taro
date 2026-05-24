import { observable } from "mobx"

export const UserStore$type = Symbol("UserStore")

export interface UserStore {
  isLoadingUser: boolean
}

export const userStore = observable<UserStore>({
  isLoadingUser: false,
})
