import { observer } from "mobx-react-lite"
import type { PropsWithChildren } from "react"

type Props = PropsWithChildren

export const WithTitle = observer(function WithTitle(props: Props) {
  const { children } = props 

  return (
    <>
      <title>Taro</title>
      {children}
    </>
  )
})
