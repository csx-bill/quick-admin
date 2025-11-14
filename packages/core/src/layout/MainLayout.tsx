import React, { useState, useEffect, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  generatePath,
  Outlet,
  matchRoutes,
} from "react-router-dom";
import { Layout, Tabs, Tab, Button } from "amis-ui";
import Header from "./Header";
import Footer from "./Footer";
import Aside from "./Aside";
import { inject, observer } from "mobx-react";
import type { IMainStore } from "@/store";
import { routes } from "@/routes";

// 导航项类型定义
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  component?: React.ComponentType;
  children?: NavItem[];
}

// 页签类型定义
export interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  projectId: string;
}

// 项目信息类型定义
export interface ProjectInfo {
  logo?: string;
  brandName: string;
}

// 布局配置类型定义
export interface LayoutSettings {
  isTabsLayout: boolean;
  showAside: boolean;
}

// 公共组件 Props 类型定义
export interface MainLayoutProps {
  store?: IMainStore;
  classnames?: any;
  
  // 新增的公共 props
  navItems: NavItem[]; // 导航项数组
  projectInfo: ProjectInfo; // 项目信息
  layoutSettings: LayoutSettings; // 布局配置
  onProjectChange?: (projectId: string) => void; // 项目变化回调
  onNavItemsGenerate?: (items: NavItem[], params: any) => NavItem[]; // 导航项生成回调
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

const MainLayout: React.FC<MainLayoutProps> = inject("store")(
  observer(({ 
    store, 
    navItems, 
    projectInfo, 
    layoutSettings: externalLayoutSettings,
    onProjectChange,
    onNavItemsGenerate 
  }) => {
    if (!store) return null;

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { projectId } = params;

    // 状态管理
    const [tabs, setTabs] = useState<TabItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

    // 根据路由配置确定布局设置（可被外部传入的设置覆盖）
    const computedLayoutSettings = useMemo(() => {
      // 如果外部传入了布局设置，优先使用外部的
      if (externalLayoutSettings) {
        return externalLayoutSettings;
      }
      
      // 否则使用原有的逻辑计算布局设置
      const matchedRoutes = matchRoutes(routes, location.pathname) || [];
      const isTabsLayout = matchedRoutes.some(
        ({ route }) => route.tabs === true
      );
      const showAside = matchedRoutes.some(({ route }) => route.aside === true);

      return {
        isTabsLayout,
        showAside,
      };
    }, [location.pathname, externalLayoutSettings]);

    // 处理项目变化
    useEffect(() => {
      if (projectId && onProjectChange) {
        onProjectChange(projectId);
      }
    }, [projectId, onProjectChange]);

    // 动态生成导航项（使用外部传入的生成函数或默认实现）
    const generatedNavItems = useMemo(() => {
      if (onNavItemsGenerate) {
        return onNavItemsGenerate(navItems, params);
      }
      
      // 默认的导航项生成逻辑
      const generateNavItems = (items: NavItem[]): NavItem[] => {
        return items.map((item) => {
          const newItem = { ...item };

          if (newItem.children) {
            newItem.children = generateNavItems(newItem.children);
          }

          if (newItem.path && projectId) {
            try {
              newItem.path = generatePath(newItem.path, { ...params });
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

      return generateNavItems(navItems);
    }, [navItems, projectId, params, onNavItemsGenerate]);

    // 处理页签逻辑
    useEffect(() => {
      if (!computedLayoutSettings.isTabsLayout || !projectId) return;

      const path = location.pathname;
      const navItem = findNavItemByPath(generatedNavItems, path);

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
      computedLayoutSettings.isTabsLayout,
      generatedNavItems,
      tabs,
      expandedPaths,
      projectId,
    ]);

    // 当项目ID变化时，清除项目的页签
    useEffect(() => {
      if (computedLayoutSettings.isTabsLayout && projectId) {
        setTabs([]);
        setActiveTab(null);
      }
    }, [projectId, computedLayoutSettings.isTabsLayout]);

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
            navItems={generatedNavItems}
            logo={projectInfo?.logo}
            brandName={projectInfo?.brandName}
          />
        }
        aside={
          computedLayoutSettings.showAside ? (
            <Aside store={store} navItems={generatedNavItems} />
          ) : null
        }
        folded={store.asideFolded}
        offScreen={store.offScreen}
        footer={<Footer />}
      >
        {/* 页签区域 */}
        {computedLayoutSettings.isTabsLayout && tabs.length > 0 && (
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
        {!computedLayoutSettings.isTabsLayout && <Outlet />}

        {/* 返回按钮 */}
        {computedLayoutSettings.isTabsLayout && (
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