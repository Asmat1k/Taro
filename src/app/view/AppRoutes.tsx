import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Paths } from "@common"
import { ChatLazyComponent } from "@unit/chat/jslazy"

export const AppRoutes = observer(function AppRoutes() {

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <>
        <Route path={Paths.path + "/"} element={<div>Hello, World!</div>}/>
        <Route path={Paths.chat.path + "/"} element={<ChatLazyComponent/>}/>
        <Route path={Paths.auth.path + "/"} element={<div>Auth page</div>}/>
      </>
    )
  )
  
  return <RouterProvider router={router}/>
})
