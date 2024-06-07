// 用户任务
// 开始
import { type FC, useState, useEffect } from 'react'
import { Form, Input, Select, Radio, type FormProps } from 'antd'

import { listRole, listUser, listDept } from '@/api/index'

interface IFormProps {
  disabled?: boolean
  formData?: Record<string, any>
  formProps?: FormProps
}
const UserTask: FC<IFormProps> = ({ disabled = false, formData, formProps = {} }) => {
  const [formRef] = Form.useForm()
  useEffect(() => {
    if (Object.keys(formData ?? {}).length && formData) {
      if (!Array.isArray(formData.permissionFlag)) {
        formData.permissionFlag = (formData.permissionFlag ?? '').split(',').filter(Boolean)
      }
      if (!Array.isArray(formData.listenerType)) {
        formData.listenerType = (formData.listenerType ?? '').split(',').filter(Boolean)
      }
    }
    formRef.setFieldsValue(formData ?? {})
  }, [formData])

  //选择角色权限范围触发
  const [groupOptions, setGroupOptions] = useState<Record<string, any>[]>([])
  const getPermissionFlag = async () => {
    const list = await Promise.all([listRole({}), listUser({}), listDept({})]).then(([role, user, dept]) => {
      return [
        {
          label: '角色',
          options: role.rows.map((item: Record<string, any>) => {
            return {
              value: 'role:' + item.roleId,
              label: item.roleName
            }
          })
        },
        {
          label: '用户',
          options: user.rows.map((item: Record<string, any>) => {
            return {
              value: 'user:' + item.userId,
              label: item.nickName
            }
          })
        },
        {
          label: '部门',
          options: dept.data.map((item: Record<string, any>) => {
            return {
              value: 'dept:' + item.deptId,
              label: item.deptName
            }
          })
        }
      ]
    })
    setGroupOptions([
      {
        label: '创建人',
        options: [
          {
            value: 'user:warmFlowInitiator',
            label: '流程发起人'
          }
        ]
      },
      ...list
    ])
  }
  useEffect(() => {
    getPermissionFlag()
  }, [])
  return (
    <Form labelCol={{ flex: '120px' }} layout='horizontal' disabled={disabled} form={formRef} labelWrap {...formProps}>
      <Form.Item label='节点编码' name='nodeCode'>
        <Input />
      </Form.Item>
      <Form.Item label='节点名称' name='nodeLabel'>
        <Input />
      </Form.Item>
      <Form.Item label='权限标识' name='permissionFlag'>
        <Select
          maxTagCount='responsive'
          placeholder='请选择权限标识'
          mode='multiple'
          showSearch
          options={groupOptions}
        />
      </Form.Item>

      <Form.Item label='是否可以跳转任意节点' name='skipAnyNode'>
        <Radio.Group
          options={[
            { value: 'N', label: '否' },
            { value: 'Y', label: '是' }
          ]}
        />
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

export default UserTask
