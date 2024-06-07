// 开始
import { type FC, useEffect } from 'react'
import { Form, Input, Select, type FormProps } from 'antd'
interface IFormProps {
  disabled?: boolean
  formData?: Record<string, any>
  formProps?: FormProps
}
const Start: FC<IFormProps> = ({ disabled = false, formData, formProps = {} }) => {
  const [formRef] = Form.useForm()
  useEffect(() => {
    if (Object.keys(formData ?? {}).length && formData && !Array.isArray(formData.listenerType)) {
      formData.listenerType = (formData.listenerType ?? '').split(',').filter(Boolean)
    }
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
      <Form.Item label='监听器类型' name='listenerType'>
        <Select
          maxTagCount='responsive'
          placeholder='请选择监听器类型'
          mode='multiple'
          options={[
            { value: 'create', label: '任务创建' },
            { value: 'start', label: '任务开始办理' },
            { value: 'assignment', label: '在任务被分配给用户或组时触发' },
            { value: 'permission', label: '权限认证' },
            { value: 'finish', label: '任务完成' }
          ]}
        />
      </Form.Item>
      <Form.Item label='监听器路径' name='listenerPath'>
        <Input.TextArea rows={8} placeholder='输入监听器的路径，以@@分隔，顺序与监听器类型一致' />
      </Form.Item>
    </Form>
  )
}
export default Start
