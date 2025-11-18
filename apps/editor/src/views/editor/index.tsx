import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { themeable } from "amis-core";
import { Icon, Button } from "amis-ui";
import { AmisEditor } from "@quick-admin-core";
import "./editor.css";
import type { IMainStore } from "@/store";
import logoUrl from '@/assets/logo.webp';

interface EditorProps {
  store?: IMainStore;
  classnames?: any;
}

const Editor: React.FC<EditorProps> = inject("store")(
  observer(({ store, classnames: cx }) => {
    const { pageId } = useParams();

    if (!store) return null;

    const { preview, setPreview, fetcher, notify, alert, copy, updateSchema } =
      store;

    //保存
    const handleSave = () => {
      const saveSchema = async () => {
        const res = await fetcher({
          url: `/api/pages/${pageId}`,
          method: "put",
          data: { id: pageId, schema: JSON.stringify(store.getSchema(pageId)) },
        });
        notify("success", "保存成功");
      };
      saveSchema();
    };

    // 初始化 schema
    useEffect(() => {
      const fetchSchema = async () => {
        const res = await fetcher({
          url: `/api/pages/${pageId}`,
          method: "get",
        });
        updateSchema(pageId, JSON.parse(res?.data?.data?.schema || {}));
      };

      fetchSchema();
    }, [pageId, updateSchema]);

    return (
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div
          id="header"
          className="flex justify-between items-center"
          style={{
            borderBottom:
              "var(--Divider-width) var(--Divider-style) var(--Divider-color)",
          }}
        >
          <div className={cx("Layout-brandBar")}>
            <div className={cx("Layout-brand")}>
              <span className="hidden-folded m-l-sm">可视化编辑器</span>
            </div>
          </div>

          <div>
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  !store.isMobile ? "is-active" : ""
                }`}
                onClick={() => {
                  store.setIsMobile(false);
                }}
              >
                <Icon icon="fa fa-television" title="移动模式" />
              </div>
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  store.isMobile ? "is-active" : ""
                }`}
                onClick={() => {
                  store.setIsMobile(true);
                }}
              >
                <Icon icon="fa fa-tablet" title="移动模式" />
              </div>
            </div>
          </div>

          <div className={cx("Layout-headerBar")}>
            <div>
              <Button level="primary" onClick={() => handleSave()} className="m-r-xs">
                保存
              </Button>
              <Button level="primary" onClick={() => setPreview(!preview)} className="m-r-xs">
                {preview ? "编辑" : "预览"}
              </Button>
              <Button level="warning" onClick={()=>{window.close();}}>退出</Button>
            </div>
          </div>
        </div>

        <AmisEditor
          theme={store.theme}
          schema={store.getSchema(pageId)}
          preview={store.preview}
          isMobile={store.isMobile}
          onChange={(value) => updateSchema(pageId, value)}
          onSave={handleSave}
          setPreview={setPreview}
          amisEnv={{
            fetcher,
            notify,
            alert,
            copy,
          }}
          data={{              // 应用 admin 访问地址
              ADMIN_URL: import.meta.env.VITE_ADMIN_URL,
              APP_TITLE: import.meta.env.VITE_APP_TITLE,
              APP_LOGO: logoUrl}}
        />
      </div>
    );
  })
);

export default themeable(Editor);
