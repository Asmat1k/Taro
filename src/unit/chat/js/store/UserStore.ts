import { observable } from "mobx"
import { type UserInfo, CardTheme } from "@common"

export const UserStore$type = Symbol("UserStore")

export interface UserStore {
  isLoadingUser: boolean
  isNewUser: boolean
  user: UserInfo | null
  cardTheme: CardTheme
  isAuthenticated: boolean
}

export const userStore = observable<UserStore>({
  isLoadingUser: false,
  user: null,
  isNewUser: true,
  cardTheme: CardTheme.Gold,
  isAuthenticated: false,
})
