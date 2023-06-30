import React from 'react';
import {
  RouteComponentProps,
  Link,
  Switch,
  matchPath,
  Route,
} from "react-router-dom";
import { Dropdown } from "antd";
import { Layout, Button, AsideNav } from "amis";
import { IMainStore } from "@/stores";
import { inject, observer } from "mobx-react";
import { request } from "@/utils/requestInterceptor";
import RouterGuard from "@/routes/RouterGuard";
import { toast } from "amis";
import appStore from "@/stores/appStore"
import Login from './common/Login';

  // 递归处理
  function processMenu(menu): NavItem[] {
    return menu.map((item) => {
      const navItem: NavItem = {
        id: item.id,
        label: item.name,
        path: item.path,
        icon: item.icon,
        hidden: item.hideInMenu,
        schema: item.schema !== null ? JSON.parse(item.schema) : {},
      };
  
      if (item.children) {
        navItem.children = processMenu(item.children);
      }
  
      return navItem;
    });
  }

type NavItem = {
  id: string;
  label: string;
  children?: Array<NavItem>;
  icon?: string;
  path?: string;
  hidden?: boolean;
  schema?: any,
  component?: React.ReactType;
  getComponent?: () => Promise<React.ReactType>;
};

function isActive(link: any, location: any) {
  const ret = matchPath(location.pathname, {
    path: link ? link.replace(/\?.*$/, "") : "",
    exact: true,
    strict: true,
  });
  return !!ret;
}

export interface AdminProps extends RouteComponentProps<any> {
  store: IMainStore;
}

@inject("store")
@observer
export default class Admin extends React.Component<AdminProps, any> {

  constructor(props: AdminProps) {
    super(props);
    this.state = {
      pathname: "",
      hasLoadMenu: false,
      // 菜单
      navigations: [],
      // 权限
      permsCode: [],
    };
  }
  
  logout = () => {
    appStore.userStore.logout();
    const history = this.props.history;
    history.replace(`/login`);
  };

  componentDidMount() {
    const history = this.props.history;
    if (!appStore.userStore.isAuthenticated) {
      toast["error"]("用户未登陆，请先登陆！", "消息");
      history.replace(`/login`);
    }else{
      this.refreshMenu();
    }
  }



  refreshMenu = () => {
    const history = this.props.history;
    let pathname = this.props.location.pathname;
    if (
      pathname != "login" &&
      pathname != "/" &&
      !this.state.hasLoadMenu &&
      appStore.userStore.isAuthenticated
    ) {
      // 接口获取菜单
      request({
        method: "get",
        url: "/api/system/SysMenu/getUserMenu",
      }).then((res: any) => {     
        // 菜单
        this.setState({
          navigations: [
            {
              //label: "导航",
              children: processMenu(res.data.data.menu)
            },
          ],
          hasLoadMenu: true,
          permsCode: res.data.data.permsCode
        });
      });
    }else{
      history.replace(`/login`);
    }
  };

  renderHeader() {
    const store = this.props.store;

    const items = [
      {
        key: "1",
        label: <span onClick={this.logout}>退出登录</span>,
      },
    ];

    return (
      <div className="fixed-header">
        <div className={`cxd-Layout-brandBar`}>
          <button
            onClick={store.toggleOffScreen}
            className="pull-right visible-xs"
          >
            <i className="fa fa-bars text-white"></i>
          </button>
          <div className={`cxd-Layout-brand`}>
            <i className="fa fa-paw"></i>
            <span className="hidden-folded m-l-sm">quick-admin</span>
          </div>
        </div>
        <div className={`cxd-Layout-headerBar`}>
        <div className="nav navbar-nav hidden-xs pull-left">
            <Button
              level="link"
              className="no-shadow navbar-btn"
              onClick={store.toggleAsideFolded}
              tooltip="展开或收起侧边栏"
              placement="bottom"
              iconOnly
            >
              <i
                className={store.asideFolded ? "fa fa-indent" : "fa fa-outdent"}
              />
            </Button>
          </div>
          <div className="m-l-auto hidden-xs pull-right pt-2" >
            <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click', 'hover']}>
              <Button>
                {appStore.userStore.name}
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }

  renderAside() {
    const location = this.props.location;
    const store = this.props.store;
  
    return (
      <div className="aside-nav-wrapper">
        <AsideNav
          key={store.asideFolded ? "folded-aside" : "aside"}
          navigations={this.state.navigations}
          renderLink={({ link, toggleExpand, classnames: cx, depth }: any) => {
            if (link.hidden) {
              return null;
            }
  
            let children: any[] = [];
  
            if (link.children && link.children.length >0) {
              children.push(
                <span
                  key="expand-toggle"
                  className={cx("AsideNav-itemArrow")}
                  onClick={(e) => toggleExpand(link, e)}
                ></span>
              );
            }
  
            link.badge &&
              children.push(
                <b
                  key="badge"
                  className={cx(
                    `AsideNav-itemBadge`,
                    link.badgeClassName || "bg-info"
                  )}
                >
                  {link.badge}
                </b>
              );
  
            if (link.icon) {
              children.push(
                <i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />
              );
            } else if (store.asideFolded && depth === 1) {
              children.push(
                <i
                  key="icon"
                  className={cx(
                    `AsideNav-itemIcon`,
                    link.children ? "fa fa-folder" : "fa fa-info"
                  )}
                />
              );
            }
            children.push(
              <span key="label" className={cx("AsideNav-itemLabel")}>
                {link.label}
              </span>
            );
  
            return link.path ? (
              link.active ? (
                <a>{children}</a>
              ) : (
                <Link to={link.path}>{children}</Link>
              )
            ) : (
              <a
                onClick={
                  link.onClick
                    ? link.onClick
                    : link.children
                    ? () => toggleExpand(link)
                    : undefined
                }
              >
                {children}
              </a>
            );
          }}
          isActive={(link: any) => isActive(link.path, location)}
        />
      </div>
    );
  }


  renderRoutes() {
    const { navigations, permsCode } = this.state;
    const render = (routes) => {
      return routes.map((item, index) => {
        if (item.children && item.children.length > 0) {
          return render(item.children);
        }

        if (item.schema) {
          return (
            <Route
              key={index}
              path={item.path}
              render={(props) => (
                <RouterGuard
                  {...props}
                  permsCode={permsCode}
                  schema={item.schema}
                />
              )}
            />
          );
        }

        return null;
      });
    };

    return (
      <Switch>
        {render(navigations)}
        <Route key="login" path="/login" component={Login} />
      </Switch>
    );
  }


  render() {
    const store = this.props.store;
    const { hasLoadMenu } = this.state;

    return (
      <Layout
        header={this.renderHeader()}
        aside={this.renderAside()}
        folded={store.asideFolded}
        offScreen={store.offScreen}
      >
        {hasLoadMenu ? this.renderRoutes() : null}
      </Layout>
    );
  }

}
