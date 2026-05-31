import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Loader, ThemeService$type, type ThemeService } from "@common"
import { UserService$type, type UserService } from "../../service"
import { useIoCBinding } from "../../ioc"
import { userStore } from "../../store"
import { SettingsModalComponent } from "../settings/SettingsModalComponent"
import { ChatComponent } from "../menu/ChatComponent"

export const AuthGateComponent = observer(function AuthGateComponent() {
  const userService = useIoCBinding<UserService>(UserService$type)
  const themeService = useIoCBinding<ThemeService>(ThemeService$type)

  useEffect(() => {
    themeService.loadAndApplyTheme()
    void userService.getUser()
  }, [ themeService, userService ])

  const { isAuthenticated } = userStore

  if (isAuthenticated === null) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return (
      <SettingsModalComponent
        open={true}
        onClose={() => {/* registration mode — non-closable */}}
        isRegistration={true}
      />
    )
  }

  return <ChatComponent />
})
