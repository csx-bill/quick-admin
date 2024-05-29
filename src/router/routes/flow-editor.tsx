import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// flow-editor module page
const FlowEditorRoute: RouteObject = {
  path: '/flow',
  name: 'Flow',
  element: <LayoutGuard />,
  meta: {
    title: '流程图编辑器',
    icon: 'flow',
    orderNo: 8
  },
  children: [
    {
      path: 'flow-editor',
      name: 'FlowEditor',
      element: LazyLoad(lazy(() => import('@/views/flow/flow-editor'))),
      meta: {
        title: '流程图',
        key: 'FlowEditor'
      }
    }
  ]
}

export default FlowEditorRoute
