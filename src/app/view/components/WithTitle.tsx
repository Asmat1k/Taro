import { observer } from "mobx-react-lite"
import { type PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"

type Props = PropsWithChildren

export const WithTitle = observer(function WithTitle(props: Props) {
  const { children } = props
  const { t } = useTranslation()

  return (
    <>
      <title>{t("app.title")}</title>
      {children}
    </>
  )
})
