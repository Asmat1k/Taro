import i18n from "@i18n"
import { Component, type ReactNode } from "react"

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error): void {
    console.error("ErrorBoundary:", error)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <h1>{i18n.t("errors.somethingWentWrong")}</h1>
    }

    return this.props.children
  }
}
