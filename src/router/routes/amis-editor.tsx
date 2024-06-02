import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LazyLoad } from '@/components/LazyLoad'

// amis-editor module page
const AmisEditorRoute: RouteObject = {
  path: '/amis/amis-editor',
  name: 'AmisEditor',
  element: LazyLoad(lazy(() => import('@/views/amis/amis-editor'))),
  meta: {
    title: '可视化编辑器',
    key: 'AmisEditor'
  },
  children: []
}

export default AmisEditorRoute
