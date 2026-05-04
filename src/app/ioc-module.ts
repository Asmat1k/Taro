import { ContainerModule } from "inversify"
import { type AppService, AppService$type, AppServiceImpl } from "./service"
import { type AppStore, AppStore$type, appStore } from "./store"

export const iocAppContainer = new ContainerModule(({ bind }) => {
  bind<AppService>(AppService$type).to(AppServiceImpl).inSingletonScope()

  bind<AppStore>(AppStore$type).toConstantValue(appStore)
})

