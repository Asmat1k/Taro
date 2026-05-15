import "@ant-design/v5-patch-for-react-19"
import "reflect-metadata"
import i18n from "@i18n"
import "./common/styles/index.scss"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Application, iocContainer, iocAppContainer } from "@app"

const root = document.getElementById("root")
if (!root) {
  throw new Error(i18n.t("errors.rootNotFound"))
}

iocContainer.load(iocAppContainer)

createRoot(root).render(
  <StrictMode>
    <Application />
  </StrictMode>,
)
