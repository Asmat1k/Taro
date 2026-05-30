import "./SettingsModalComponent.scss"
import { useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import {
  Form,
  Input,
  Modal,
  Radio,
  Spin,
} from "antd"
import { CardTheme, type UserInfo, themeStore, ThemeService$type, type ThemeService } from "@common"
import { UserService$type, type UserService } from "../../service"
import { useIoCBinding } from "../../ioc"
import { userStore } from "../../store"


const { TextArea } = Input
type FormValues = UserInfo & { cardTheme: CardTheme }

type Props = {
  open: boolean
  onClose: VoidFunction
  isRegistration?: boolean
}

export const SettingsModalComponent = observer(function SettingsModalComponent({ open, onClose, isRegistration = false }: Props) {
  const { t } = useTranslation()
  const userService = useIoCBinding<UserService>(UserService$type)
  const themeService = useIoCBinding<ThemeService>(ThemeService$type)
  const [ form ] = Form.useForm<FormValues>()

  const isLoading = userStore.isLoadingUser

  useEffect(() => {
    if (!open) {
      return
    }

    const populate = (user: UserInfo | null) => {
      form.setFieldsValue({
        name: user?.name ?? "",
        description: user?.description,
        cardTheme: themeStore.cardTheme,
      })
    }

    if (userStore.user) {
      populate(userStore.user)
    } else {
      void userService.getUser().then(populate)
    }
  }, [ form, open, userService ])

  const onSave = useCallback(async() => {
    const values = await form.validateFields()
    if (values.cardTheme) {
      themeService.applyTheme(values.cardTheme)
    }
    onClose()
    void userService.saveUser(values.name, values.description)
  }, [ form, onClose, themeService, userService ])

  const title = isRegistration
    ? t("chat.settingsModal.titleRegistration")
    : t("chat.settingsModal.title")

  return (
    <Modal
      title={title}
      open={open}
      onCancel={isRegistration ? undefined : onClose}
      onOk={onSave}
      okText={isRegistration ? t("chat.settingsModal.startButton") : t("common.save")}
      okButtonProps={{ disabled: isLoading || form.getFieldsError().length > 0 }}
      cancelText={isRegistration ? null : t("common.cancel")}
      cancelButtonProps={isRegistration ? { style: { display: "none" } } : undefined}
      closable={!isRegistration}
      maskClosable={!isRegistration}
      keyboard={!isRegistration}
      destroyOnClose
    >
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form<FormValues>
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={t("chat.settingsModal.name")}
            rules={[
              {
                required: true,
                message: t("chat.settingsModal.validation.nameRequired"),
              },
            ]}
          >
            <Input
              placeholder={t("chat.settingsModal.placeholders.name")}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t("chat.settingsModal.description")}
          >
            <TextArea
              rows={4}
              placeholder={t("chat.settingsModal.placeholders.description")}
            />
          </Form.Item>

          <Form.Item
            name="cardTheme"
            label={t("chat.settingsModal.cardTheme.label")}
          >
            <Radio.Group className="settings-theme-group">
              <Radio.Button value={CardTheme.Pink} className="settings-theme-option settings-theme-option--pink">
                <span className="settings-theme-option__icon">💖</span>
                <span className="settings-theme-option__name">{t("chat.settingsModal.cardTheme.pink")}</span>
              </Radio.Button>
              <Radio.Button value={CardTheme.Gold} className="settings-theme-option settings-theme-option--gold">
                <span className="settings-theme-option__icon">✨</span>
                <span className="settings-theme-option__name">{t("chat.settingsModal.cardTheme.gold")}</span>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
})
