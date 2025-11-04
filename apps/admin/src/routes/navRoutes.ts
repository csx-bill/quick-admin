// 导航项类型定义
export interface NavItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    component?: React.ComponentType;
    children?: NavItem[];
    visible?: boolean,
  }
  
  const navRoutes: NavItem[] = [
    {
      id: "config",
      label: "项目配置",
      icon: "fa fa-cog",
      path: "/project/:projectId/:pageId",
    },
    {
      id: "menus",
      label: "菜单配置",
      icon: "fa fa-cog",
      path: "/project/:projectId/:pageId",
    },
  ];
  
  export default navRoutes;