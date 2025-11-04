import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { inject, observer } from "mobx-react";
import axios from "axios";
import { render as renderAmis } from "amis";
import type { IMainStore } from "@/store";

interface Props {
  store?: IMainStore;
  classnames?: any;
  schema?: any;
}

const AmisRenderer: React.FC<Props> = inject("store")(
  observer(({ store, classnames: cx, schema }) => {
    if (!store) return null;

    const params = useParams();
    const navigate = useNavigate();

    //let amisScoped;
    let theme = store.theme;
    let locale = "zh-CN";

    // 请勿使用 React.StrictMode，目前还不支持
    return (
      <>
        {renderAmis(
          schema,
          {
            // props...
            // locale: 'en-US' // 请参考「多语言」的文档
            // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
            data: {
              // 全局上下文数据
              params: params,
            },
          },
          {
            // 下面三个接口必须实现
            fetcher: store.fetcher,
            isCancel: (value: any) => (axios as any).isCancel(value),
            copy: store.copy,
            theme,

            // 后面这些接口可以不用实现

            // 默认是地址跳转
            jumpTo: (
              location: string /*目标地址*/,
              action: any /* action对象*/
            ) => {
              // 用来实现页面跳转, actionType:link、url 都会进来。
              if (
                action &&
                action.actionType === "url" &&
                action.blank === false
              ) {
                navigate(location);
                return;
              } else if (action && action.blank) {
                // hash 路由 新窗口打开
                window.open(`#${location}`, "_blank");
                return;
              } else {
                navigate(location);
              }
            },

            // updateLocation: (
            //   location: string /*目标地址*/,
            //   replace: boolean /*是replace，还是push？*/
            // ) => {
            //   // 地址替换，跟 jumpTo 类似
            // },

            // getModalContainer: () => {
            //   // 弹窗挂载的 DOM 节点
            // },

            // isCurrentUrl: (
            //   url: string /*url地址*/,
            // ) => {
            //   // 用来判断是否目标地址当前地址
            // },
            notify: store.notify,
            alert: store.alert,
            // confirm,
            // tracker: (eventTracke) => {}
          }
        )}
      </>
    );
  })
);

export default AmisRenderer;
