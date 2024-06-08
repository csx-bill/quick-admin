import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons'
import { getSchema, updateSchema } from '@/api'

import { fetcher, theme } from '@/utils/amisEnvUtils'
import './editor.scss'
import type { SchemaObject } from 'amis'
import { Editor, ShortcutKey } from 'amis-editor'
import { alert, AlertComponent, confirm, toast, ToastComponent } from 'amis-ui'
import copy from 'copy-to-clipboard'
import 'amis-editor-core/lib/style.css'
import 'amis/lib/helper.css'
// 编辑器 这里要引入 cxd 否则鼠标右键显示UI 异常
import 'amis/lib/themes/cxd.css'
import 'amis/sdk/iconfont.css'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'

const AmisEditor: React.FC = () => {
  //const { initialState } = useModel('@@initialState')
  //const params = useParams()

  const [preview, setPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [schema, setSchema] = useState<SchemaObject>({} as SchemaObject)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    //localStorage.setItem('suda-i18n-locale', getLocale());
    async function fetchSchema() {
      const res = await getSchema({ id: searchParams.get('id') })
      setSchema(res.data.data?.schema !== null ? JSON.parse(res.data.data?.schema) : {})
    }
    fetchSchema()
  }, [])

  // 当前语言
  //const curLanguage = getLocale()

  async function save() {
    // 调用保存接口
    const res = await updateSchema({ id: searchParams.get('id'), schema: JSON.stringify(schema) })

    toast.success('保存成功', '提示')
  }

  function onChange(value: any) {
    setSchema(value)
  }

  function exit() {
    window.close()
  }

  return (
    <div className='Editor'>
      <div className='Editor-header'>
        <div className='Editor-title'>amis 可视化编辑器</div>
        <div className='Editor-view-mode-group-container'>
          <div className='Editor-view-mode-group'>
            <div
              className={`Editor-view-mode-btn editor-header-icon ${!isMobile ? 'is-active' : ''}`}
              onClick={() => {
                setIsMobile(false)
              }}
            >
              {/* PC模式 */}
              <DesktopOutlined />
            </div>
            <div
              className={`Editor-view-mode-btn editor-header-icon ${isMobile ? 'is-active' : ''}`}
              onClick={() => {
                setIsMobile(true)
              }}
            >
              {/* 移动模式 */}
              <MobileOutlined />
            </div>
          </div>
        </div>

        <div className='Editor-header-actions'>
          <ShortcutKey />

          {/* 国际化 */}
          {/* <SelectLang key="SelectLang" /> */}

          <div
            className={`header-action-btn m-1 ${preview ? 'primary' : ''}`}
            onClick={() => {
              setPreview(!preview)
            }}
          >
            {preview ? '编辑' : '预览'}
          </div>
          {/* 保存 */}
          {!preview && (
            <div className={`header-action-btn exit-btn`} onClick={save}>
              保存
            </div>
          )}
          {/* 退出 */}
          {!preview && (
            <div className={`header-action-btn exit-btn`} onClick={exit}>
              退出
            </div>
          )}
        </div>
      </div>
      <div className='Editor-inner'>
        <ToastComponent theme={'cxd'} key='toast' position={'top-center'} /* locale={curLanguage} */ />
        <AlertComponent theme={'cxd'} key='alert' /*locale={curLanguage} */ />

        <Editor
          theme={'cxd'}
          preview={preview}
          isMobile={isMobile}
          value={schema}
          onChange={onChange}
          onPreview={() => {
            setPreview(true)
          }}
          onSave={save}
          className='is-fixed'
          showCustomRenderersPanel={true}
          amisEnv={{
            fetcher,
            //notify: notify,
            alert: alert,
            copy: copy,
            confirm: confirm
          }}
          //data={{ permsCode: initialState?.currentUser?.permsCode }}
        />
      </div>
    </div>
  )
}

export default AmisEditor
