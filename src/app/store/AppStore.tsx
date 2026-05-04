import { observable } from "mobx"

/*
* Этот стор - пример, никакой логики он не несет
*/

export const AppStore$type = Symbol("AppStore")

export interface AppStore {
  count: number
}

export const appStore = observable<AppStore>({
  count: 0,
})
