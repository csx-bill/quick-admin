// 定义流程节点类型
enum WarmType {
  START = 'start', // 开始节点
  BETWEEN = 'between', // 中间节点
  END = 'end', // 结束节点
  SERIAL = 'serial', // 互斥网关（排他网关）
  PARALLEL = 'parallel', // 并行网关
  SKIP = 'skip' // 连接线
}

// 定义流程节点类型对应的 BPMN 类型
const WarmTypeMap: { [key: string]: string } = {
  start: 'bpmn:startEvent',
  skip: 'bpmn:sequenceFlow',
  between: 'bpmn:userTask',
  end: 'bpmn:endEvent',
  serial: 'bpmn:exclusiveGateway',
  parallel: 'bpmn:parallelGateway'
}

// 根据 BPMN 类型获取流程节点类型
function getWarmType(type: string): string {
  switch (type) {
    case 'bpmn:sequenceFlow':
      return WarmType.SKIP
    case 'bpmn:startEvent':
      return WarmType.START
    case 'bpmn:endEvent':
      return WarmType.END
    case 'bpmn:userTask':
      return WarmType.BETWEEN
    case 'bpmn:exclusiveGateway':
      return WarmType.SERIAL
    case 'bpmn:parallelGateway':
      return WarmType.PARALLEL
    default:
      return type
  }
}

// 特定的节点标签数组
const NODE_NAMES: string[] = ['start', 'between', 'serial', 'parallel', 'end']

// 流程定义中的属性键数组
const DEFINITION_KEYS: string[] = ['flowCode', 'flowName', 'version', 'fromCustom', 'fromPath']

// 节点属性键数组
const NODE_ATTR_KEYS: string[] = [
  'nodeType',
  'nodeCode',
  'nodeName',
  'coordinate',
  'permissionFlag',
  'skipAnyNode',
  'listenerType',
  'listenerPath'
]

// 跳跃节点属性键数组
const SKIP_ATTR_KEYS: string[] = ['skipName', 'skipType', 'coordinate', 'skipCondition']

// 定义节点接口（类型）
interface Node {
  id: string
  type: string
  text: {
    value?: string
    x?: number
    y?: number
  }
  properties: { [key: string]: any }
  x?: number
  y?: number
}

// 定义边接口（类型）
interface Edge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  type: string
  properties: { [key: string]: any }
  text: { [key: string]: any }
  pointsList?: { x: number; y: number }[]
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
}

// 定义转换后的流程数据接口（类型）
interface GraphData {
  flowCode?: string
  flowName?: string
  version?: string
  fromCustom?: string
  fromPath?: string
  nodes: Node[]
  edges: Edge[]
}

// LogicFlow 转 WarmFlow 中间调度对象接口定义
interface WarmAdapterOptions {
  lf: {
    adapterIn: Function
    adapterOut: Function
  }
}

// LogicFlow 数据转换成 WarmFlow XML 定义文件
export const logicFlowJsonToFlowXml = (data: GraphData, definition: any): string => {
  // node 转换
  data.nodes = data.nodes.map(node => {
    return convertLogicFlowElementToWarmFlowElement(node)
  })
  // edge 转换
  data.edges = data.edges.map(edge => {
    return convertLogicFlowElementToWarmFlowElement(edge)
  })

  // 将LogicFlow中的Node数据转换为warm-flow元素数据
  function convertLogicFlowElementToWarmFlowElement<T extends Node | Edge>(element: T): T {
    return {
      ...element, // 复制element中的所有属性
      type: getWarmType(element.type) // 只更新type属性
    }
  }

  data.flowCode = definition.flowCode // 流程定义编码
  data.flowName = definition.flowName // 流程定义名称
  data.version = definition.version // 流程定义版本号
  data.fromCustom = definition.fromCustom // 表单自定义
  data.fromPath = definition.fromPath // 表单自定义路径

  let xml = ''
  // data的数据由流程定义文件信息+logicFlow数据构成
  // 先构建成流程对象
  const definitionObj: Record<string, any> = {
    flowCode: data.flowCode, // 流程定义编码
    flowName: data.flowName, // 流程定义名称
    version: data.version, // 流程定义版本号
    fromCustom: data.fromCustom, // 表单自定义
    fromPath: data.fromPath // 表单自定义路径
  }
  /**
   * 获取开始节点
   * @returns
   */
  const getStartNode = () => {
    return data.nodes.find(node => {
      return node.type === 'start'
    })
  }
  /**
   * 获取当前节点的所有下一个节点集合
   * @param {*} id 当前节点名称
   * @returns
   */
  const getNextNodes = (id: string) => {
    return data.edges
      .filter(edge => {
        return edge.sourceNodeId === id
      })
      .map(edge => {
        return data.nodes.find(node => {
          return node.id === edge.targetNodeId
        })
      })
  }
  /**
   * 获取节点所有跳转
   * @param {*} id
   * @returns
   */
  const getSkip = (id: string) => {
    return data.edges
      .filter(edge => {
        return edge.sourceNodeId === id
      })
      .map(edge => {
        let coordinate = ''
        if (edge.pointsList) {
          for (let i = 0; i < edge.pointsList.length; i++) {
            const print = edge.pointsList[i]
            if (print) {
              coordinate = coordinate + parseInt(print.x + '') + ',' + parseInt(print.y + '')
              if (i !== edge.pointsList.length - 1) {
                coordinate = coordinate + ';'
              }
            }
          }
        }
        if (edge.text) {
          coordinate = coordinate + '|' + parseInt(edge.text.x) + ',' + parseInt(edge.text.y)
        }
        return {
          skipType: edge.properties.skipType,
          skipCondition: edge.properties.skipCondition,
          skipName: edge.properties.skipName,
          textContent: edge.targetNodeId, // 目地节点id
          coordinate: coordinate
        }
      })
  }
  /**
   * 构建节点属性
   * @param {} node
   * @returns
   */
  const buildNode = (node: Node) => {
    let textXy = ''
    if (node.text) {
      textXy = '|' + node.text.x + ',' + node.text.y
    }
    return {
      nodeType: node.type,
      nodeCode: node.id,
      nodeName: node.text instanceof String || node.text === undefined ? node.text : node.text.value,
      permissionFlag: node.properties.permissionFlag,
      skipAnyNode: node.properties.skipAnyNode,
      listenerType: node.properties.listenerType,
      listenerPath: node.properties.listenerPath,
      coordinate: node.x + ',' + node.y + textXy,
      skip: getSkip(node.id)
    }
  }
  /**
   * 特殊字符转义
   * @param {*} text
   * @returns
   */
  const textEncode = (text: string) => {
    text = text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return text
  }
  /**
   * 递归构建节点属性
   * @param {} node
   */
  const recursionBuildNode = (node: Node) => {
    const nodeName = node.type
    if (!definitionObj[nodeName + '_' + node.id]) {
      definitionObj[nodeName + '_' + node.id] = buildNode(node)
      const nextNodes = getNextNodes(node.id)
      nextNodes.forEach(nextNode => {
        nextNode && recursionBuildNode(nextNode)
      })
    }
  }
  const startNode = getStartNode()
  if (!startNode) {
    // 开始节点不存在，xml不合法
    return ''
  }
  recursionBuildNode(startNode)
  xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<definition'
  Object.keys(definitionObj).forEach(key => {
    const value = definitionObj[key]
    if (DEFINITION_KEYS.includes(key) && value) {
      xml += ' ' + key + '=' + '"' + textEncode(value) + '"'
    }
  })
  xml += '>\n'
  // 生成节点xml
  Object.keys(definitionObj).forEach(key => {
    const value = definitionObj[key]
    const nodeName = key.split('_')[0]
    if (NODE_NAMES.includes(nodeName)) {
      xml += '\t<node'
      // 构造属性
      Object.keys(value).forEach(nodeAttrKey => {
        if (NODE_ATTR_KEYS.includes(nodeAttrKey) && value[nodeAttrKey]) {
          xml += ' ' + nodeAttrKey + '=' + '"' + textEncode(value[nodeAttrKey]) + '"'
        }
      })
      xml += '>\n\t'
      // 构建skip
      if (value.skip) {
        value.skip.forEach((skip: Record<string, any>) => {
          xml += '\t<skip'
          // skip属性
          Object.keys(skip).forEach(skipAttrKey => {
            if (SKIP_ATTR_KEYS.includes(skipAttrKey) && skip[skipAttrKey]) {
              xml += ' ' + skipAttrKey + '=' + '"' + textEncode(skip[skipAttrKey]) + '"'
            }
          })
          xml += '>'
          xml += skip['textContent'] + '</skip>\n'
        })
      }
      xml += '\t</node>\n'
    }
  })
  xml += '</definition>'
  return xml
}

// WarmFlow XML 定义文件转换成 LogicFlow 支持的数据格式
export const snakerXml2LogicFlowJson = (xml: string): GraphData => {
  const graphData: GraphData & Record<string, any> = {
    nodes: [],
    edges: []
  }
  const xmlDoc = parseXml2Dom(xml)
  const definitionDom = xmlDoc.getElementsByTagName('definition')
  if (!definitionDom.length) {
    return graphData
  }
  let value = null
  // 解析definition属性
  DEFINITION_KEYS.forEach(key => {
    value = definitionDom[0].getAttribute(key)
    if (value) {
      graphData[key] = value
    }
  })
  let nodeEles = null
  let node: Element | null = null
  let lfNode: Node = {} as Node
  // 解析节点
  nodeEles = definitionDom[0].getElementsByTagName('node')
  if (nodeEles.length) {
    for (let i = 0, len = nodeEles.length; i < len; i++) {
      node = nodeEles[i]
      lfNode = {
        text: {},
        properties: {}
      } as Node
      // 处理节点
      NODE_ATTR_KEYS.forEach(attrKey => {
        value = node?.getAttribute(attrKey)
        if (value) {
          if (attrKey === 'nodeType') {
            lfNode.type = WarmTypeMap[value]
          } else if (attrKey === 'nodeCode') {
            lfNode.id = value
          } else if (attrKey === 'coordinate') {
            const attr = value.split('|')
            const nodeXy = attr[0].split(',')
            lfNode.x = parseInt(nodeXy[0])
            lfNode.y = parseInt(nodeXy[1])
            if (attr.length === 2) {
              const textXy = attr[1].split(',')
              lfNode.text.x = parseInt(textXy[0])
              lfNode.text.y = parseInt(textXy[1])
            }
          } else if (attrKey === 'nodeName') {
            lfNode.text.value = value
          } else {
            lfNode.properties[attrKey] = value
          }
        }
      })
      graphData.nodes.push(lfNode)
      // 处理边
      let skipEles = null
      let skipEle: Element | null = null
      let edge: Edge = {} as Edge
      skipEles = node.getElementsByTagName('skip')
      for (let j = 0, lenn = skipEles.length; j < lenn; j++) {
        skipEle = skipEles[j]
        edge = {
          text: {},
          properties: {}
        } as Edge
        edge.id = skipEle.getAttribute('id') ?? ''
        edge.type = WarmTypeMap['skip']
        edge.sourceNodeId = lfNode.id
        edge.targetNodeId = skipEle.textContent ?? ''
        edge.text = {
          value: skipEle.getAttribute('skipName')
        }
        edge.properties.skipCondition = skipEle.getAttribute('skipCondition')
        edge.properties.skipName = skipEle.getAttribute('skipName')
        edge.properties.skipType = skipEle.getAttribute('skipType')
        const expr = skipEle.getAttribute('expr')
        if (expr) {
          edge.properties.expr = expr
        }
        const coordinate = skipEle.getAttribute('coordinate')
        if (coordinate) {
          const coordinateXy = coordinate.split('|')
          edge.pointsList = []
          coordinateXy[0].split(';').forEach(item => {
            const pointArr = item.split(',')
            edge.pointsList!.push({
              x: parseInt(pointArr[0]),
              y: parseInt(pointArr[1])
            })
          })
          edge.startPoint = edge.pointsList[0]
          edge.endPoint = edge.pointsList[edge.pointsList.length - 1]
          if (coordinateXy.length > 1) {
            const textXy = coordinateXy[1].split(',')
            edge.text.x = parseInt(textXy[0])
            edge.text.y = parseInt(textXy[1])
          }
        }
        graphData.edges.push(edge)
      }
    }
  }

  return graphData
}

// 解析 XML 成 DOM 对象
export const parseXml2Dom = (xml: string): Document => {
  let xmlDoc = null
  if (window.DOMParser) {
    const parser = new DOMParser()
    xmlDoc = parser.parseFromString(xml, 'text/xml')
  } else {
    // Internet Explorer
    // eslint-disable-next-line no-undef
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
    xmlDoc.async = false
    xmlDoc.loadXML(xml)
  }
  return xmlDoc as Document
}

// LogicFlow 和 WarmFlow 适配器
class WarmAdapter {
  static pluginName = 'warmAdapter'

  // 构造函数的参数类型使用了之前定义的接口类型
  constructor({ lf }: WarmAdapterOptions) {
    lf.adapterIn = this.adapterIn
    lf.adapterOut = this.adapterOut
  }

  adapterOut(logicFlowData: GraphData, definition: any): string {
    if (logicFlowData) {
      return logicFlowJsonToFlowXml(logicFlowData, definition)
    }
    return ''
  }

  adapterIn(warmData: string): GraphData | undefined {
    if (warmData) {
      return snakerXml2LogicFlowJson(warmData)
    }
  }
}

export default WarmAdapter
