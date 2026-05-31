import { Suspense, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { XProvider } from "@ant-design/x"
import { Loader, themeStore } from "@common"
import { AppErrorBoundary } from "./AppErrorBoundary"
import { AppRoutes } from "./AppRoutes"
import { WithTitle } from "./components/WithTitle"
import { ANTD_THEMES } from "./antdThemes"

export const Application = observer(function Application() {
  const cardTheme = themeStore.cardTheme

  useEffect(() => {
    document.body.setAttribute("data-card-theme", cardTheme)
  }, [ cardTheme ])

  return (
    <AppErrorBoundary>
      <XProvider theme={ANTD_THEMES[cardTheme]}>
        <WithTitle>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </WithTitle>
      </XProvider>
    </AppErrorBoundary>
  )
})
