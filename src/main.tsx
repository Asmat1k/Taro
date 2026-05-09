import "reflect-metadata"
import "antd/dist/reset.css"
import "./common/view/styles/theme.scss" //TODO перенести в единый файл стилей
import i18n from "@i18n"
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
