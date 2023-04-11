import React, { useState } from 'react';

import { SelectLang } from '@/components/RightContent';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import { Editor } from 'amis-editor';
import 'amis-editor-core/lib/style.css';
import 'amis/lib/helper.css';
import 'amis/lib/themes/cxd.css';
import 'amis/sdk/iconfont.css';

import { alert, AlertComponent, confirm, toast, ToastComponent } from 'amis-ui';
// React 版本 英文翻译
import 'amis-ui/lib/locale/en-US';
import copy from 'copy-to-clipboard';

import { save as saveMenuSchema } from '@/services/quick-admin-api/menuschema';
import { getLocale } from 'umi';

import axios from 'axios';

interface EditorProps {
  schema?: any;
  id: string;
}

const AMISEditor: React.FC<EditorProps> = (props) => {
  const [preview, setPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [schemaJson, setSchemaJson] = useState({});

  // let amisScoped;
  const theme = 'cxd';
  // 当前语言
  const curLanguage = getLocale();

  const schema = props.schema;
  const id = props.id;

  function exit() {
    window.close();
  }

  function save() {
    // 调用保存接口
    saveMenuSchema({ id: id, schemaJson: schemaJson } as API.SysMenuSchema);
    toast.success('保存成功', '提示');
  }

  function onChange(value: any) {
    setSchemaJson(JSON.stringify(value));
  }

  return (
    <div className="Editor-Demo">
      <div className="Editor-header">
        <div className="Editor-title">可视化编辑器</div>
        <div className="Editor-view-mode-group-container">
          <div className="Editor-view-mode-group">
            <div
              className={`Editor-view-mode-btn editor-header-icon ${!isMobile ? 'is-active' : ''}`}
              onClick={() => {
                setIsMobile(false);
              }}
            >
              {/* PC模式 */}
              <DesktopOutlined />
            </div>
            <div
              className={`Editor-view-mode-btn editor-header-icon ${isMobile ? 'is-active' : ''}`}
              onClick={() => {
                setIsMobile(true);
              }}
            >
              {/* 移动模式 */}
              <MobileOutlined />
            </div>
          </div>
        </div>

        <div className="Editor-header-actions">
          {/* 语言选择 */}
          <SelectLang key="SelectLang" />
          <div
            className={`header-action-btn m-1 ${preview ? 'primary' : ''}`}
            onClick={() => {
              setPreview(!preview);
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

      <div>
        <ToastComponent theme={theme} key="toast" position={'top-center'} locale={curLanguage} />
        <AlertComponent theme={theme} key="alert" locale={curLanguage} />

        <Editor
          value={schema}
          theme={theme}
          isMobile={isMobile}
          preview={preview}
          onChange={onChange}
          onSave={save}
          onPreview={() => {
            setPreview(true);
          }}
          amisEnv={{
            fetcher: ({
              url, // 接口地址
              method, // 请求方法 get、post、put、delete
              data, // 请求数据
              responseType,
              config, // 其他配置
              headers, // 请求头
            }: any) => {
              config = config || {};
              config.withCredentials = true;
              responseType && (config.responseType = responseType);

              if (config.cancelExecutor) {
                config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor);
              }

              config.headers = headers || {};

              if (method !== 'post' && method !== 'put' && method !== 'patch') {
                if (data) {
                  config.params = data;
                }

                return (axios as any)[method](url, config);
              } else if (data && data instanceof FormData) {
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'multipart/form-data';
              } else if (
                data &&
                typeof data !== 'string' &&
                !(data instanceof Blob) &&
                !(data instanceof ArrayBuffer)
              ) {
                data = JSON.stringify(data);
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/json';
              }

              return (axios as any)[method](url, data, config);
            },
            //notify: notify,
            alert: alert,
            copy: copy,
            confirm: confirm,
          }}
        />
      </div>
    </div>
  );
};

export default AMISEditor;
