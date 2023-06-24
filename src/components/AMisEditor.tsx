import React, { useState, useEffect } from 'react'
import {Editor, ShortcutKey} from 'amis-editor';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast, Select} from 'amis';
import {currentLocale} from 'i18n-runtime';
import {IMainStore} from '../stores';
import { request } from "@/utils/requestInterceptor";


// css
import 'amis-editor-core/lib/style.css';
import '../scss/editor.scss';


const editorLanguages = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
];


export default inject('store')(
  observer(function ({
    store,
    location,
    history,
    match
  }: {store: IMainStore} & RouteComponentProps<{id: string}>) {
    
    const [schema, setSchema] = useState(null);

    const id = match.params.id;
    const curLanguage = currentLocale(); // 获取当前语料类型

    // 从接口获取 schema
    useEffect(() => {
      async function fetchSchema() {
        await request({
          method: "get",
          url: `/api/system/SysMenu/getSchema?id=${id}`,
        }).then((res: any) => {     
          setSchema(res.data.data.schema !== null ? JSON.parse(res.data.data.schema) : {});
        });
      }
      fetchSchema();
    }, [id]);

    function save() {
      async function fetchSchema() {
        await request({
          method: "put",
          url: `/api/system/SysMenu/updateSchemaById`,
          data: {
            id: id,
            schema: JSON.stringify(schema)
          },
        }).then((res: any) => {     
        });
      }
      fetchSchema();
      toast.success('保存成功', '提示');
    }

    function onChange(value: any) {
      setSchema(value)
    }

    function changeLocale(value: string) {
      localStorage.setItem('suda-i18n-locale', value);
      window.location.reload();
    }

    function exit() {
      window.close();
    }

    return (
      <div className="Editor">
        <div className="Editor-header">
          <div className="Editor-title">amis 可视化编辑器</div>
          <div className="Editor-view-mode-group-container">
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  !store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(false);
                }}
              >
                PC
              </div>
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(true);
                }}
              >
                H5
              </div>
            </div>
          </div>

          <div className="Editor-header-actions">
            <ShortcutKey />
            <Select
              className="margin-left-space"
              options={editorLanguages}
              value={curLanguage}
              clearable={false}
              onChange={(e: any) => changeLocale(e.value)}
            />
            <div
              className={`header-action-btn m-1 ${
                store.preview ? 'primary' : ''
              }`}
              onClick={() => {
                store.setPreview(!store.preview);
              }}
            >
              {store.preview ? '编辑' : '预览'}
            </div>
            {!store.preview && (
              <div className={`header-action-btn exit-btn`} onClick={exit}>
                退出
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            theme={'cxd'}
            preview={store.preview}
            isMobile={store.isMobile}
            value={schema}
            onChange={onChange}
            onPreview={() => {
              store.setPreview(true);
            }}
            onSave={save}
            className="is-fixed"
            showCustomRenderersPanel={true}
            amisEnv={{
              fetcher: store.fetcher,
              notify: store.notify,
              alert: store.alert,
              copy: store.copy
            }}
          />
        </div>
      </div>
    );
  })
);
