import "reflect-metadata"
import "antd/dist/reset.css"
import "./common/view/styles/theme.scss" //TODO перенести в единый файл стилей
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Application, iocContainer, iocAppContainer } from "@app"

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found")
}

iocContainer.load(iocAppContainer)

createRoot(root).render(
  <StrictMode>
    <Application />
  </StrictMode>,
)
