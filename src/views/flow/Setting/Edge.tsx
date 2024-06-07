// 连线
import { type FC, useEffect } from 'react'
import { Form, Input, Select, type FormProps } from 'antd'
interface IFormProps {
  disabled?: boolean
  formData?: Record<string, any>
  formProps?: FormProps
  skipConditionShow?: boolean
}
const Edge: FC<IFormProps> = ({ skipConditionShow = true, disabled = false, formData, formProps = {} }) => {
  const [formRef] = Form.useForm()
  useEffect(() => {
    formRef.setFieldsValue(formData ?? {})
    if (Object.keys(formData ?? {}).length && !formData?.skipType) {
      formProps?.onValuesChange?.({ skipType: 'PASS' }, formData)
    }
  }, [formData])
  const handleChange = () => {
    const condition = formRef.getFieldValue('condition')
    const conditionType = formRef.getFieldValue('conditionType')
    const conditionValue = formRef.getFieldValue('conditionValue')
    const skipCondition =
      '@@' +
      (conditionType ? conditionType : '') +
      '@@|' +
      (condition ? condition : '') +
      '@@' +
      (conditionType ? conditionType : '') +
      '@@' +
      (conditionValue ? conditionValue : '')
    formRef.setFieldValue('skipCondition', skipCondition)
    formProps?.onValuesChange?.({ skipCondition: skipCondition }, formRef.getFieldsValue())
  }
  return (
    <Form labelCol={{ flex: '120px' }} layout='horizontal' disabled={disabled} form={formRef} {...formProps}>
      {skipConditionShow ? (
        <Form.Item label='跳转名称' name='skipName'>
          <Input />
        </Form.Item>
      ) : null}

      <Form.Item label='跳转类型' name='skipType' initialValue='PASS'>
        <Select
          placeholder='请选择跳转类型'
          options={[
            { value: 'PASS', label: '审批通过' },
            { value: 'REJECT', label: '退回' }
          ]}
        />
      </Form.Item>
      {skipConditionShow ? (
        <Form.Item label='跳转条件'>
          <Form.Item name='condition' noStyle>
            <Input placeholder='条件名' style={{ width: '25%' }} onChange={handleChange} />
          </Form.Item>
          <Form.Item name='conditionType' noStyle>
            <Select
              style={{ width: '40%', marginLeft: 10 }}
              placeholder='请选择条件方式'
              options={[
                { value: 'gt', label: '大于' },
                { value: 'ge', label: '大于等于' },
                { value: 'eq', label: '等于' },
                { value: 'ne', label: '不等于' },
                { value: 'lt', label: '小于' },
                { value: 'le', label: '小于等于' },
                { value: 'like', label: '包含' },
                { value: 'notLike', label: '不包含' }
              ]}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item name='conditionValue' noStyle>
            <Input placeholder='条件值' style={{ width: '25%', marginLeft: 10 }} onChange={handleChange} />
          </Form.Item>
        </Form.Item>
      ) : null}
    </Form>
  )
}

export default Edge
