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
import navRoutes from "@/routes/navRoutes";
import { inject, observer } from "mobx-react";
import type { IMainStore } from "@/store";
import { routes } from "@/routes";
import { fetcher } from "@/api";

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

interface Props {
  store?: IMainStore;
  classnames?: any;
}

const MainLayout: React.FC<Props> = inject("store")(
  observer(({ store }) => {
    if (!store) return null;

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const { projectId } = params;

    // 状态管理
    const [tabs, setTabs] = useState<TabItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    // logo,
    const [logo, setLogo] = useState<string | null>(null);
    const [brandName, setBrandName] = useState<string | null>(null);

    // 根据路由配置确定布局设置
    const layoutSettings = useMemo(() => {
      const matchedRoutes = matchRoutes(routes, location.pathname) || [];

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
    }, [location.pathname]);

    // 设置项目信息
    useEffect(() => {
      if (projectId) {
        const fetchData = async () => {
          const res = await fetcher({
            url: `/api/projects/${projectId}`,
            method: "get",
          });
          setLogo(res.data.data.logo);
          setBrandName(res.data.data.projectName);
        };

        fetchData();
      } else {
        setLogo("品牌名称");
        setBrandName("logo.png");
      }
    }, [projectId]);

    // 动态生成导航项
    const NAV_ITEMS = useMemo(() => {
      const generateNavItems = (items: NavItem[]): NavItem[] => {
        return items.map((item) => {
          const newItem = { ...item };

          // 递归处理子项
          if (newItem.children) {
            newItem.children = generateNavItems(newItem.children);
          }

          // 替换路径中的参数
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

      return generateNavItems(navRoutes);
    }, [projectId, params]);

    // 处理页签逻辑
    useEffect(() => {
      if (!layoutSettings.isTabsLayout || !projectId) return;

      const path = location.pathname;
      const navItem = findNavItemByPath(NAV_ITEMS, path);

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
      NAV_ITEMS,
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
            navItems={NAV_ITEMS}
            logo={logo}
            brandName={brandName}
          />
        }
        aside={
          layoutSettings.showAside ? (
            <Aside store={store} navItems={NAV_ITEMS} />
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
