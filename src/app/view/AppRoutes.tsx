import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { defaultPath } from "@common"
import { ChatLazyComponent } from "@unit/chat/jslazy"

export const AppRoutes = observer(function AppRoutes() {

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path={defaultPath + "*"} element={<ChatLazyComponent/>}/>
      </>
    )
  )
  
  return <RouterProvider router={router}/>
})
