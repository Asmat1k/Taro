import { Suspense, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { theme, type ThemeConfig } from "antd"
import { XProvider } from "@ant-design/x"
import { CardTheme, Loader, themeStore } from "@common"
import { AppErrorBoundary } from "./AppErrorBoundary"
import { AppRoutes } from "./AppRoutes"
import { WithTitle } from "./components/WithTitle"

const ANTD_THEMES: Record<CardTheme, ThemeConfig> = {
  [CardTheme.Pink]: {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary:         "#d4007a",
      colorBgBase:          "#fce4f5",
      colorTextBase:        "#5a003a",
      colorBorder:          "#f9b8e8",
      colorBorderSecondary: "#f5c8ea",
      colorFill:            "#f7d0ee",
      colorFillSecondary:   "#fbe8f7",
      colorFillTertiary:    "#fdf0fb",
      colorFillQuaternary:  "#fef6fd",
    },
  },
  [CardTheme.Gold]: {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary:         "#c49010",
      colorBgBase:          "#18140c",
      colorTextBase:        "#f0d060",
      colorBorder:          "#3d3315",
      colorBorderSecondary: "#4a3e18",
      colorFill:            "#2a2310",
      colorFillSecondary:   "#241e0e",
      colorFillTertiary:    "#1e180a",
      colorFillQuaternary:  "#1a1508",
    },
  },
}

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
