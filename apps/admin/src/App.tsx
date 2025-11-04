import React, { useEffect } from "react";
import "amis/lib/helper.css";
import "amis/sdk/iconfont.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/css/v4-shims.css";
import { Provider } from "mobx-react";
import { MainStore } from "@/store";
import axios from "axios";
import { fetcher } from "@/api";
import copy from "copy-to-clipboard";
import { toast, alert, confirm } from "amis";
import { ToastComponent, AlertComponent, Spinner } from "amis";
import { setDefaultTheme } from "amis-core";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routes } from "@/routes";

// 动态加载主题CSS
const themeMap = {
  cxd: () => import("amis/lib/themes/cxd.css"),
  antd: () => import("amis/lib/themes/antd.css"),
  dark: () => import("amis/lib/themes/dark.css"),
  ang: () => import("amis/lib/themes/ang.css"),
};

const loadTheme = async (theme: string) => {
  const loader = themeMap[theme] || themeMap.cxd;
  return loader();
};

// 路由渲染组件
const RouteRenderer = () => {
  return useRoutes(routes);
};

// 应用入口
const App = () => {
  const store = ((window as any).store = MainStore.create(
    {},
    {
      fetcher: fetcher,
      isCancel: (value: any) => (axios as any).isCancel(value),
      notify: (type: "success" | "error" | "info", msg: string) => {
        toast[type]
          ? toast[type](msg, type === "error" ? "系统错误" : "系统消息")
          : console.warn("[Notify]", type, msg);
        console.log("[notify]", type, msg);
      },
      alert,
      confirm,
      copy: (content) => {
        copy(content);
        toast.success("内容已复制到粘贴板");
      },
    }
  ));

  // 动态加载CSS
  useEffect(() => {
    loadTheme(store.theme);
    setDefaultTheme(store.theme);
  }, [store.theme]);

  return (
    <Provider store={store}>
      <Router>
        <ToastComponent key="toast" position={"top-right"} />
        <AlertComponent key="alert" />
        <React.Suspense
          fallback={<Spinner overlay className="m-t-lg" size="lg" />}
        >
          <RouteRenderer />
        </React.Suspense>
      </Router>
    </Provider>
  );
};

export default App;
