import { Suspense } from "react"
import { observer } from "mobx-react-lite"
import { Loader } from "@common"
import { AppErrorBoundary } from "./AppErrorBoundary"
import { AppRoutes } from "./AppRoutes"
import { WithTitle } from "./components/WithTitle"

export const Application = observer(function Application() {
  return (
    <AppErrorBoundary>
      <WithTitle>
        <Suspense fallback={<Loader/>}>
          <AppRoutes/>
        </Suspense>
      </WithTitle>
    </AppErrorBoundary>
  )
})
