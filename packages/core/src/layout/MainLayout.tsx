import React, { useState, useEffect, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Outlet,
  matchRoutes,
} from "react-router-dom";
import { Layout, Tabs, Tab, Button } from "amis-ui";
import { Header,Footer,Aside } from "@quick-admin-core";
import { inject, observer } from "mobx-react";
import type { IMainStore } from "../store";
import ProjectService from "../store/projectService";

import logoUrl from '@/assets/logo.webp';

// 导航项类型定义
interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  component?: React.ComponentType;
  children?: NavItem[];
}

// 页签类型定义
interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  projectId: string;
}

// 递归查找导航项
const findNavItemByPath = (items: NavItem[], path: string): NavItem | null => {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }
    if (item.children) {
      const found = findNavItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
};

// 项目信息接口
export interface ProjectInfo {
  id: string;
  name: string;
  logo?: string;
}

interface Props {
  store?: IMainStore;
  classnames?: any;
  // 项目信息配置
  projectInfo?: ProjectInfo | null;
  // 项目信息加载函数
  onLoadProjectInfo?: (projectId: string) => Promise<ProjectInfo>;
  // 导航配置
  navItems?: NavItem[] | null;
  // 导航加载函数
  onLoadNavItems?: (projectId?: string) => Promise<NavItem[]>;
  // 使用函数方式延迟获取路由配置
  getAppRoutes?: () => any[];
}

const MainLayout: React.FC<Props> = inject("store")(
  observer(({ store, projectInfo, onLoadProjectInfo, navItems: propNavItems,onLoadNavItems,getAppRoutes}) => {
    if (!store) return null;

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { projectId } = params;

    // 状态管理
    const [tabs, setTabs] = useState<TabItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    // 项目信息状态
    const [currentProjectInfo, setCurrentProjectInfo] = useState<ProjectInfo | null>(projectInfo || null);
    // 导航状态
    const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>([]);

    // 根据路由配置确定布局设置
    const layoutSettings = useMemo(() => {
      if (!getAppRoutes) {
        return { isTabsLayout: false, showAside: false };
      }

      // 延迟获取路由配置
      const appRoutes = getAppRoutes();
      const matchedRoutes = matchRoutes(appRoutes, location.pathname) || [];

      // 查找是否有标记为 tabs: true 的路由
      const isTabsLayout = matchedRoutes.some(
        ({ route }) => route.tabs === true
      );

      // 查找是否有标记为 aside: true 的路由
      const showAside = matchedRoutes.some(({ route }) => route.aside === true);

      return {
        isTabsLayout,
        showAside,
      };
    }, [location.pathname,getAppRoutes]);

    // 设置项目信息 - 支持多种方式
    useEffect(() => {
      const setupProjectInfo = async () => {
        // 优先级 1: 直接传入的 projectInfo
        if (projectInfo) {
          setCurrentProjectInfo(projectInfo);
          return;
        }

        // 优先级 2: 通过 onLoadProjectInfo 函数加载
        if (onLoadProjectInfo && projectId) {
            const info = await onLoadProjectInfo(projectId);
            setCurrentProjectInfo(info);
          return;
        }
        // 默认值
        setCurrentProjectInfo({
          id: projectId || '',
          name: import.meta.env.VITE_APP_TITLE,
          logo: logoUrl,
        });
      };

      setupProjectInfo();
    }, [projectInfo, onLoadProjectInfo, projectId]);

    // 设置项目ID到服务中，支持多标签页
    useEffect(() => {
      if (projectId) {
        ProjectService.setCurrentProjectId(projectId);
      } else {
        ProjectService.clearCurrentProjectId();
      }
    }, [projectId]);

    // 设置导航菜单（与项目信息逻辑保持一致）
    useEffect(() => {
      const setupNavItems = async () => {
        // 优先级 1: 直接传入的 navItems
        if (propNavItems) {
          setCurrentNavItems(propNavItems);
          return;
        }

        // 优先级 2: 通过 onLoadNavItems 函数加载
        if (onLoadNavItems && projectId) {
            const items = await onLoadNavItems(projectId);
            setCurrentNavItems(items);
          return;
        }
      };

      setupNavItems();
    }, [propNavItems, onLoadNavItems, projectId]);

    // 处理页签逻辑
    useEffect(() => {
      if (!layoutSettings.isTabsLayout || !projectId) return;

      const path = location.pathname;
      const navItem = findNavItemByPath(currentNavItems, path);

      if (navItem) {
        const tabKey = navItem.path;

        // 清理不属于当前项目的页签
        setTabs((prevTabs) =>
          prevTabs.filter((tab) => tab.projectId === projectId)
        );

        // 添加新页签（如果不存在）
        if (
          !tabs.some((tab) => tab.key === tabKey && tab.projectId === projectId)
        ) {
          setTabs((prevTabs) => [
            ...prevTabs.filter((tab) => tab.projectId === projectId),
            {
              key: tabKey,
              label: navItem.label,
              path: navItem.path,
              icon: navItem.icon,
              projectId: projectId,
            },
          ]);
        }

        // 激活当前页签
        setActiveTab(tabKey);

        // 更新展开状态
        const newExpandedPaths = new Set(expandedPaths);
        const pathSegments = path.split("/").filter(Boolean);

        let currentPath = "";
        for (const segment of pathSegments.slice(0, -1)) {
          currentPath = `${currentPath}/${segment}`;
          newExpandedPaths.add(currentPath);
        }

        setExpandedPaths(newExpandedPaths);
      }
    }, [
      location.pathname,
      layoutSettings.isTabsLayout,
      currentNavItems,
      tabs,
      expandedPaths,
      projectId,
    ]);

    // 当项目ID变化时，清除项目的页签
    useEffect(() => {
      if (layoutSettings.isTabsLayout && projectId) {
        setTabs([]);
        setActiveTab(null);
      }
    }, [projectId, layoutSettings.isTabsLayout]);

    // 关闭页签
    const handleTabClose = (key: string) => {
      const newTabs = tabs.filter((tab) => tab.key !== key);
      setTabs(newTabs);

      if (key === activeTab) {
        const currentIndex = tabs.findIndex((tab) => tab.key === key);
        let nextTab = null;

        if (currentIndex < tabs.length - 1) {
          nextTab = tabs[currentIndex + 1];
        } else if (currentIndex > 0) {
          nextTab = tabs[currentIndex - 1];
        }

        if (nextTab) {
          setActiveTab(nextTab.key);
          navigate(nextTab.path);
        } else {
          navigate("/projects");
        }
      }
    };

    // 切换页签
    const handleTabSelect = (key: string) => {
      const tab = tabs.find((t) => t.key === key);
      if (tab) {
        setActiveTab(key);
        navigate(tab.path);
      }
    };

    return (
      <Layout
        header={
          <Header
            store={store}
            logo={currentProjectInfo?.logo || logoUrl}
            brandName={currentProjectInfo?.name || 'Quick Admin'}
          />
        }
        aside={
          layoutSettings.showAside ? (
            <Aside store={store} navItems={currentNavItems} />
          ) : null
        }
        folded={store.asideFolded}
        offScreen={store.offScreen}
        footer={<Footer />}
      >
        {/* 页签区域 */}
        {layoutSettings.isTabsLayout && tabs.length > 0 && (
          <div id="tabsLayout">
            <Tabs
              mode="line"
              activeKey={activeTab}
              onSelect={handleTabSelect}
              onClose={handleTabClose}
              closable={tabs.length > 1}
              draggable
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.key}
                  eventKey={tab.key}
                  icon={tab.icon}
                  title={tab.label}
                >
                  <Outlet />
                </Tab>
              ))}
            </Tabs>
          </div>
        )}

        {/* 非 tabs 内容区域 */}
        {!layoutSettings.isTabsLayout && <Outlet />}

        {/* 返回按钮 */}
        {layoutSettings.isTabsLayout && (
          <div className="fixed bottom-3/4 right-2 z-1000">
            <Button level="primary" onClick={() => navigate("/projects")}>
              返回
            </Button>
          </div>
        )}
      </Layout>
    );
  })
);

export default MainLayout;
