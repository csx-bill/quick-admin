import Footer from '@/components/Footer';
import { Question, SelectLang } from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history ,KeepAliveContext } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from './api/user';
import { getRoutes } from '@/api/routes';

import React from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

import AMISRenderer from '@/pages/amis/AMISRenderer';
import OnlineRenderer from '@/pages/amis/OnlineRenderer';
import { addLocale,getLocale } from 'umi';
import zhCN from '@/locales/zh-CN/menu';
import enUS from '@/locales/en-US/menu';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { dropByCacheKey,keepElements } = React.useContext<any>(KeepAliveContext);
  return {
    // 从服务端请求当前登录用户的菜单
    menu: {
      locale: false,
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: initialState,
      request: async (params, defaultMenuData) => {
        return traverseMenu(initialState?.currentUser?.userMenuTree);
      },
    },
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // 水印
    // waterMarkProps: {
    //   content: initialState?.currentUser?.realName,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }

      // 同一个页签 搜索参数变更时 更新路由
      const cacheEle=keepElements?.current[location.pathname]
      if(cacheEle && cacheEle?.location?.search !== location.search){
        dropByCacheKey(location.pathname)
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? []
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

// render 配置配合使用，请求服务端根据响应动态更新路由
let extraRoutes;

export function patchClientRoutes({ routes }) {
  let router = [];
  for (var route of routes) {
    // 只有往这里添加路由才能 layout 打开
    if(route.id ==='ant-design-pro-layout'){
      router = route;
      break;
    }
  }
  // eslint-disable-next-line no-var
  for (var item of extraRoutes) {
    router.children[0].routes.push(item);
  }
}

export async function render(oldRender) {
  try {
    // 请求服务端路由
    const res = await getRoutes();
    // 处理路由
    extraRoutes = traverseMenu(res.data);
    oldRender();
  } catch (error) {
    console.log(error)
  }
}

function traverseMenu(data) {

  return data.map((item) => {
    // 动态添加多语言
    const key = item.path.replace(/^\//, 'menu.').replace(/\//g, '.');

    // 动态语言 解决 多页名称显示问题
    const locale = getLocale();
    addLocale(
      locale,
      {
        [key]:item.name,
      },
      {
        momentLocale: locale,
        antd: locale==='zh-CN'?zhCN:enUS,
      },
    );

    if (item.menuType === "DIR") {
      return {
        name: item.name,
        //path: item.path,
        //icon: 'smile',
        //element: <AMISRenderer />,
        children: traverseMenu(item.children),
      };
    } else if (item.menuType === "MENU") {
      if(item.path.startsWith('/online/formList/')){
        return {
          name: item.name,
          path: item.path,
        //icon: 'smile',
        element: <OnlineRenderer />,
        };
      }else{
        // 待实现 动态加载 组件
        return {
          name: item.name,
          path: item.path,
          //icon: 'smile',
          element: <AMISRenderer/>,
        };

      }

    }
  });
}
