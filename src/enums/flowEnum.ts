export enum FlowEditorNodeTypeEnum {
  START = 'bpmn:startEvent',
  END = 'bpmn:endEvent',
  USER_TASK = 'bpmn:userTask',
  EXCLUSIVE_GATEWAY = 'bpmn:exclusiveGateway',
  PARALLEL_GATEWAY = 'bpmn:parallelGateway',
  EDGE = 'bpmn:sequenceFlow'
}
