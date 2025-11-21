import React from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRoute,MainLayout } from "@quick-admin-core";
import Admin from "@/views/admin";
import { NotFound } from "amis-ui";
import { fetcher } from "@quick-admin-core";

const Login = React.lazy(() => import("@/views/login"));
const Projects = React.lazy(() => import("@/views/projects"));

// 路由配置类型
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  tabs?: boolean; // 多页签布局
  aside?: boolean; // 是否显示侧边栏
}

// 路由配置数组
export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to="/projects" replace />,
    index: true,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
                <MainLayout 
        // 项目信息
        onLoadProjectInfo={async (projectId) => {
          const res = await fetcher({
              url: `/api/projects/${projectId}`,
              method: "get",
          });
          return {
            id: projectId,
            name: res.data.data.projectName,
            logo: res.data.data.logo
          };
        }}
        // 导航
        onLoadNavItems={async (projectId) => {

          const res = await fetcher({
            url: `/api/menus/tree`,
            method: "get",
            data: { projectId: projectId },
          });

          const transformMenuToNavItems = (apiMenu: []): any[] => {
            return apiMenu.map((item) => {
              const navItem: any = {
                id: item.id,
                label: item.name,
                icon: item.icon,
                path:
                  item.pageId != null ? `/project/${item.projectId}/${item.pageId}` : "",
                menuType: item.menuType,
                children: item.children ? transformMenuToNavItems(item.children) : [],
              };
              return navItem;
            });
          };
        return transformMenuToNavItems(res?.data?.data);
        }}
        // 路由
        getAppRoutes={() => routes}
        />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/project/:projectId",
        tabs: true,
        aside: true,
        children: [
          {
            path: ":pageId",
            element: <Admin />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
