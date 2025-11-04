import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/layout/MainLayout";
import Config from "@/views/admin/config";
import Pages from "@/views/admin/pages";
import Users from "@/views/admin/users";
import Roles from "@/views/admin/roles";
import Menus from "@/views/admin/menus";

import { NotFound } from "amis-ui";

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
        <MainLayout />
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
      {
        path: "/editor/:pageId/edit",
        element: <Editor />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
