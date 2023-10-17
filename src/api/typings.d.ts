// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username?: string;
    realName?: string;
    avatar?: string;
    userId?: string;
    permsCode?:string[];
    userMenuTree?:any;
  };

  type LoginResult = {
    status?: number;
    type?: string;
    msg?: string;
    data?: any;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };



  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };



  type UserMenuResult = {
    menu?:RoutesNodeResult[],
    permsCode?:string[]
  }

  // 路由 && 菜单
  type RoutesNodeResult = {
    id?: string;
    parentId?: string,
    chineseName?: string,
    englishName?: string,
    perms?: string,
    icon?: string,
    path?: string,
    orderNo?: string,
    menuType?: string,
    hideInMenu?: boolean,
    status?: string,
    component?: string,
    children?: Routes[];
  };
  type Routes = {
    id?: string;
    parentId?: string,
    chineseName?: string,
    englishName?: string,
    perms?: string,
    icon?: string,
    path?: string,
    orderNo?: string,
    menuType?: string,
    hideInMenu?: boolean,
    status?: string,
    component?: string,
  };
}
