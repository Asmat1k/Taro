import "./SettingsModalComponent.scss"
import { useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import {
  Form,
  Input,
  Modal,
  Radio,
  Skeleton,
} from "antd"
import { CardTheme, type UserInfo, themeStore } from "@common"
import { UserService$type, type UserService, ThemeService$type, type ThemeService } from "../../service"
import { useIoCBinding } from "../../ioc"
import { userStore } from "../../store"


const { TextArea } = Input
type FormValues = UserInfo & { cardTheme: CardTheme }

type Props = {
  open: boolean
  onClose: VoidFunction
}

export const SettingsModalComponent = observer(function SettingsModalComponent({ open, onClose }: Props) {
  const { t } = useTranslation()
  const userService = useIoCBinding<UserService>(UserService$type)
  const themeService = useIoCBinding<ThemeService>(ThemeService$type)
  const [ form ] = Form.useForm<FormValues>()

  const isLoading = userStore.isLoadingUser

  useEffect(() => {
    if (!open) {
      return
    }

    void userService.getUser()
      .then((user) => {
        form.setFieldsValue({
          name: user.name,
          description: user.description,
          cardTheme: themeStore.cardTheme,
        })
      })

  }, [ form, open, userService ])

  const onSave = useCallback(async() => {
    const values = await form.validateFields()
    if (values.cardTheme) {
      themeService.applyTheme(values.cardTheme)
    }
    console.log(values)
    onClose()
  }, [ form, onClose, themeService ])

  return (
    <Modal
      title={t("chat.settingsModal.title")}
      open={open}
      onCancel={onClose}
      onOk={onSave}
      okText={t("common.save")}
      okButtonProps={{ disabled: isLoading || form.getFieldsError().length > 0 }}
      cancelText={t("common.cancel")}
      destroyOnClose
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
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
