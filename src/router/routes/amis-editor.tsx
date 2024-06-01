import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// amis-editor module page
const AmisEditorRoute: RouteObject = {
  path: '/amis',
  name: 'Amis',
  element: <LayoutGuard />,
  meta: {
    title: '可视化编辑器',
    icon: 'amis',
    orderNo: 8
  },
  children: [
    {
      path: 'amis-editor',
      name: 'AmisEditor',
      element: LazyLoad(lazy(() => import('@/views/amis/amis-editor'))),
      meta: {
        title: '可视化编辑器',
        key: 'AmisEditor'
      }
    }
  ]
}

export default AmisEditorRoute
