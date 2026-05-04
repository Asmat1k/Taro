import { inject, injectable } from "inversify"
import { runInAction } from "mobx"
import { type AppStore, AppStore$type } from "../store"

/*
* Этот сервис - пример, никакой логики он не несет
*/

export const AppService$type = Symbol("AppService")

export interface AppService {
  increment(): void

  decrement(): void
}

@injectable()
export class AppServiceImpl implements AppService {
  increment(): void {
    console.log("Increment")
    runInAction(() => {
      this.appStore.count += 1
    })
  }

  decrement(): void {
    console.log("Decrement")
    runInAction(() => {
      this.appStore.count -= 1
    })
  }

  constructor(
    @inject(AppStore$type) private appStore: AppStore
  ) {
  }
}
