import { useEffect, useState, useMemo, type FC } from 'react'
import { Drawer, type DrawerProps } from 'antd'
import Edge from './Edge'
import Start from './Start'
import End from './End'
import UserTask from './UserTask'
import Gateway from './Gateway'
import { FlowEditorNodeTypeEnum } from '@/enums/flowEnum'
import type LogicFlow from '@logicflow/core'
interface ISettingProps extends DrawerProps {
  lf: LogicFlow
  node: Record<string, any> | null
  updateNode?: (node: Record<string, any>) => void
  disabled?: boolean
  skipConditionShow?: boolean
}
const SettingDrawer: FC<ISettingProps> = ({
  lf,
  node,
  disabled = false,
  skipConditionShow = true,
  updateNode,
  ...props
}) => {
  const FormElement = useMemo<FC<Record<string, any>>>(() => {
    let Component: FC<Record<string, any>> = () => null
    switch (node?.type) {
      case FlowEditorNodeTypeEnum.START:
        Component = Start
        break
      case FlowEditorNodeTypeEnum.END:
        Component = End
        break
      case FlowEditorNodeTypeEnum.USER_TASK:
        Component = UserTask
        break
      case FlowEditorNodeTypeEnum.EXCLUSIVE_GATEWAY:
      case FlowEditorNodeTypeEnum.PARALLEL_GATEWAY:
        Component = Gateway
        break
      case FlowEditorNodeTypeEnum.EDGE:
        Component = Edge
        break
      default:
        Component = () => null
        break
    }
    return Component
  }, [node?.type])

  const settingTitle = useMemo<string>(() => {
    let title: string = ''
    switch (node?.type) {
      case FlowEditorNodeTypeEnum.START:
        title = '设置开始属性'
        break
      case FlowEditorNodeTypeEnum.END:
        title = '设置结束属性'
        break
      case FlowEditorNodeTypeEnum.USER_TASK:
        title = '设置用户任务属性'
        break
      case FlowEditorNodeTypeEnum.EXCLUSIVE_GATEWAY:
        title = '设置排它网关属性'
        break
      case FlowEditorNodeTypeEnum.PARALLEL_GATEWAY:
        title = '设置并行网关属性'
        break
      case FlowEditorNodeTypeEnum.EDGE:
        title = '设置边属性'
        break
      default:
        title = ''
        break
    }
    return title
  }, [node?.type])

  const [formData, setFormData] = useState<Record<string, any>>({})
  useEffect(() => {
    if (!node) {
      setFormData({})
      return
    }
    const skipCondition = node.properties?.skipCondition
    const conditionSpl = skipCondition ? skipCondition.split('@@|') : []
    const conditionSplTwo = conditionSpl && conditionSpl.length > 0 ? conditionSpl[1] : []
    if (node.type === FlowEditorNodeTypeEnum.EDGE) {
      setFormData({
        nodeType: node.type,
        skipType: node.properties.skipType,
        skipName: node.properties.skipName,
        skipCondition: skipCondition,
        condition: conditionSplTwo && conditionSplTwo.length > 0 ? conditionSplTwo.split('@@')[0] : '',
        conditionType: conditionSplTwo && conditionSplTwo.length > 0 ? conditionSplTwo.split('@@')[1] : void 0,
        conditionValue: conditionSplTwo && conditionSplTwo.length > 0 ? conditionSplTwo.split('@@')[2] : ''
      })
    } else {
      setFormData({
        nodeType: node.type,
        nodeCode: node.id,
        nodeLabel: node.text instanceof Object ? node.text.value : node.text,
        ...node.properties
      })
    }
  }, [node?.type, node?.id])

  const handleValueChange = (value: any, all: any) => {
    console.log('handleValueChange ~ value:', value)
    setFormData(formData => ({ ...formData, ...value }))
  }

  // 更新节点ID
  useEffect(() => {
    if (node?.id && formData.nodeCode && lf) {
      if (formData.nodeCode === node.id) {
        return
      }
      if ([FlowEditorNodeTypeEnum.EDGE].includes(node.type)) {
        if (!lf.getEdgeModelById(formData.nodeCode)) {
          lf.changeEdgeId(node.id, formData.nodeCode)
          updateNode?.(lf.getEdgeDataById(formData.nodeCode))
        }
      } else {
        if (!lf.getNodeModelById(formData.nodeCode)) {
          lf.changeNodeId(node.id, formData.nodeCode)
          updateNode?.(lf.getNodeDataById(formData.nodeCode))
        }
      }
    }
  }, [formData.nodeCode])

  // 更新节点名称
  useEffect(() => {
    if (node?.id && lf) {
      lf.updateText(node.id, formData.nodeLabel)
      lf.setProperties(node.id, {
        nodeName: formData.nodeLabel
      })
    }
  }, [formData.nodeLabel])

  // 更新权限标志
  useEffect(() => {
    if (node?.id && lf) {
      const val = formData.permissionFlag
      lf.setProperties(node.id, {
        permissionFlag: Array.isArray(val) ? val.join(',') : val
      })
    }
  }, [formData.permissionFlag])

  // 更新监听器类型
  useEffect(() => {
    if (node?.id && lf) {
      const val = formData.listenerType
      lf.setProperties(node.id, {
        listenerType: Array.isArray(val) ? val.join(',') : val
      })
    }
  }, [formData.listenerType])

  // 更新侦听器路径
  useEffect(() => {
    if (node?.id && lf) {
      lf.setProperties(node.id, {
        listenerPath: formData.listenerPath
      })
    }
  }, [formData.listenerPath])

  // 更新跳转类型
  useEffect(() => {
    if (node?.id && lf) {
      lf.setProperties(node.id, {
        skipType: formData.skipType
      })
    }
  }, [formData.skipType])

  // 更新跳转名称
  useEffect(() => {
    if (node?.id && lf) {
      if ([FlowEditorNodeTypeEnum.EDGE].includes(node.type)) {
        lf.updateText(node.id, formData.skipName)
        lf.setProperties(node.id, {
          skipName: formData.skipName
        })
      }
    }
  }, [formData.skipName])

  // 更新跳转节点
  useEffect(() => {
    if (node?.id && lf) {
      lf.setProperties(node.id, {
        skipAnyNode: formData.skipAnyNode
      })
    }
  }, [formData.skipAnyNode])

  // 更新跳转条件
  useEffect(() => {
    if (node?.id && lf) {
      lf.setProperties(node.id, {
        skipCondition: formData.skipCondition
      })
    }
  }, [formData.skipCondition])

  return (
    <Drawer width={480} maskClosable={false} keyboard={false} destroyOnClose={true} title={settingTitle} {...props}>
      <FormElement
        disabled={disabled}
        skipConditionShow={skipConditionShow}
        formData={formData}
        formProps={{
          onValuesChange: handleValueChange
        }}
      />
    </Drawer>
  )
}

export default SettingDrawer
