import React from "react";
import { Navigate,generatePath } from "react-router-dom";
import { ProtectedRoute,MainLayout } from "@quick-admin-core";
import Config from "@/views/admin/config";
import Pages from "@/views/admin/pages";
import Users from "@/views/admin/users";
import Roles from "@/views/admin/roles";
import Menus from "@/views/admin/menus";
import navRoutes from "@/routes/navRoutes";

import { NotFound } from "amis-ui";
import { fetcher } from "@/api";

const Login = React.lazy(() => import("@/views/login"));
const Projects = React.lazy(() => import("@/views/projects"));
const Editor = React.lazy(() => import("@/views/editor"));

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
          const generateNavItems = (items: any[]): any[] => {
          return items.map((item) => {
            const newItem = { ...item };

            // 递归处理子项
            if (newItem.children) {
              newItem.children = generateNavItems(newItem.children);
            }

            // 替换路径中的参数
            if (newItem.path && projectId) {
              try {
                newItem.path = generatePath(newItem.path, { projectId });
              } catch (error) {
                console.error(
                  `Failed to generate path for ${newItem.path}:`,
                  error
                );
              }
            }

            return newItem;
          });
        };

        return generateNavItems(navRoutes);
        }}
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
            path: "config",
            element: <Config />,
          },
          {
            path: "pages",
            element: <Pages />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "roles",
            element: <Roles />,
          },
          {
            path: "menus",
            element: <Menus />,
          },
        ],
      },

    ],
  },
  {
    path: "/editor/:pageId/edit",
    element: <Editor />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
