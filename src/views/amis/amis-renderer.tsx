import React, { useState, useEffect } from 'react'
import { getSchemaByPath } from '@/api'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import copy from 'copy-to-clipboard'
import { render as renderAmis } from 'amis'
import { ToastComponent, AlertComponent, toast } from 'amis-ui'
import 'amis/lib/themes/antd.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import { fetcher, theme } from '@/utils/amisEnvUtils'

const AmisRenderer: React.FC = () => {
  const location = useLocation()
  const [schema, setSchema] = useState({})

  useEffect(() => {
    // 接口获取
    async function findCurrentMenu(path: any) {
      const res = await getSchemaByPath({ path: path })
      console.log('res', res)
      setSchema(res)
    }

    const pathname = location.pathname
    findCurrentMenu(pathname)
  }, [])

  return (
    <div>
      <ToastComponent theme={theme} key='toast' position={'top-center'} />
      <AlertComponent theme={theme} key='alert' />

      {renderAmis(
        schema,
        {
          // props...
          //locale: curLanguage, // 请参考「多语言」的文档
          // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
          context: {
            // 全局上下文数据, 非受控的数据，无论哪一层都能获取到，包括弹窗自定义数据映射后都能获取到。
            // 取值方式 ${permsCode}
            //permsCode: initialState?.currentUser?.permsCode
          }
        },
        {
          // 下面三个接口必须实现
          fetcher,
          isCancel: (value: any) => (axios as any).isCancel(value),
          copy: content => {
            copy(content)
            toast.success('内容已复制到粘贴板')
          },
          theme,
          // 默认是地址跳转
          jumpTo: (location: string /*目标地址*/, action: any /* action对象*/) => {
            // 实现 amis 触发 多页签打开
            // 用来实现页面跳转, actionType:link、url 都会进来。
            if (action && action.actionType === 'url' && action.blank === false) {
              history.push(location)
              return
            } else if (action && action.blank) {
              window.open(location, '_blank')
              return
            } else {
              history.push(location)
            }
          }
        }
      )}
    </div>
  )
}
export default AmisRenderer
