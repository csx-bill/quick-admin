// 导航项类型定义
export interface NavItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    menuType:string;
    component?: React.ComponentType;
    children?: NavItem[];
    visible?: boolean,
  }
  
  const navRoutes: NavItem[] = [
    {
      id: "1",
      label: "项目配置",
      icon: "fa fa-cog",
      path: "/project/:projectId/config",
      menuType: "menu",
    },
    {
        id: "2",
        label: "页面管理",
        icon: "fa fa-files-o",
        path: "/project/:projectId/pages",
        menuType: "menu",
    },
    {
        id: "3",
        label: "用户管理",
        icon: "fa fa-users",
        path: "/project/:projectId/users",
        menuType: "menu",
    },
    {
        id: "4",
        label: "角色管理",
        icon: "fa fa-id-card",
        path: "/project/:projectId/roles",
        menuType: "menu",
    },
    {
        id: "5",
        label: "菜单管理",
        icon: "fa fa-bars",
        path: "/project/:projectId/menus",
        menuType: "menu",
    },
  ];
  
  export default navRoutes;