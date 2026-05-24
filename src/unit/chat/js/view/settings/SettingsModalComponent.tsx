import { useCallback, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import {
  Form,
  Input,
  Modal,
  Skeleton,
} from "antd"
import { type UserInfo } from "@common"
import { UserService$type, type UserService } from "../../service"
import { useIoCBinding } from "../../ioc"
import { userStore } from "../../store"


const { TextArea } = Input

type Props = {
  open: boolean
  onClose: VoidFunction
}

export const SettingsModalComponent = observer(function SettingsModalComponent({ open,onClose }: Props) {
  const { t } = useTranslation()
  const userService = useIoCBinding<UserService>(UserService$type)
  const [ form ] = Form.useForm<UserInfo>()

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
      })
    })

  }, [ form, open, userService ])

  const onSave = useCallback(async() => {
    const values = await form.validateFields()
    console.log(values)
    onClose()
  }, [ form, onClose ])

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
        <Form<UserInfo>
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
        </Form>
      )}
    </Modal>
  )
})
