// 结束
import { type FC, useEffect } from 'react'
import { Form, Input, type FormProps } from 'antd'
interface IFormProps {
  disabled?: boolean
  formData?: Record<string, any>
  formProps?: FormProps
}
const End: FC<IFormProps> = ({ disabled = false, formData, formProps = {} }) => {
  const [formRef] = Form.useForm()
  useEffect(() => {
    formRef.setFieldsValue(formData ?? {})
  }, [formData])
  return (
    <Form labelCol={{ flex: '120px' }} layout='horizontal' disabled={disabled} form={formRef} {...formProps}>
      <Form.Item label='节点编码' name='nodeCode'>
        <Input />
      </Form.Item>
      <Form.Item label='节点名称' name='nodeLabel'>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default End
