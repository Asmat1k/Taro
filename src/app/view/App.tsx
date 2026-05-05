import { Suspense } from "react"
import { observer } from "mobx-react-lite"
import { theme } from "antd"
import { XProvider } from "@ant-design/x"
import { Loader } from "@common"
import { AppErrorBoundary } from "./AppErrorBoundary"
import { AppRoutes } from "./AppRoutes"
import { WithTitle } from "./components/WithTitle"

export const Application = observer(function Application() {
  return (
    <XProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <AppErrorBoundary>
        <WithTitle>
          <Suspense fallback={<Loader/>}>
            <AppRoutes/>
          </Suspense>
        </WithTitle>
      </AppErrorBoundary>
    </XProvider>
  )
})
