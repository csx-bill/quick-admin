import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { themeable } from "amis-core";
import { Icon } from "amis-ui";
import { AsideNav } from "./AsideNav";

// Aside 组件
const Aside = (props: {
  classnames: any;
  store: IAppStore;
  navItems: any[];
}) => {
  const { classnames: cx, store, navItems } = props;
  const location = useLocation();

  const navigate = useNavigate();

  // 处理导航点击
  const handleNavClick = (e: React.MouseEvent, link: any) => {
    e.preventDefault();
    if (link.menuType === "menu") {
      navigate(link.path);
    }
  };

  return (
    <div id="tabsAsideNav">
      <AsideNav
        classnames={cx}
        navigations={[
          {
            children: navItems,
          },
        ]}
        renderLink={(
          { link, active, toggleExpand, classnames: cx, depth, subHeader }: any,
          key: any
        ) => {
          let children = [];

          if (link.visible === false) {
            return null;
          }

          // 图标
          if (link.icon) {
            children.push(
              <Icon
                key="icon"
                cx={cx}
                icon={link.icon}
                className={cx("AsideNav-itemIcon")}
              />
            );
          }
          // 标题
          children.push(
            <span className={cx("AsideNav-itemLabel")} key="label">
              {link.label}
            </span>
          );

          // 展开/折叠 图标
          if (link.children && link.children.length > 0) {
            children.push(
              <span
                key="expand-toggle"
                className={cx("AsideNav-itemArrow")}
              ></span>
            );
          }

          return link.path ? (
            /^https?\:/.test(link.path) ? (
              // 渲染外部链接（带新标签页打开）
              <a target="_blank" key="link" href={link.path} rel="noopener">
                {children}
              </a>
            ) : (
              // 渲染内部路由链接（使用自定义导航处理）
              <a key="link" onClick={(e) => handleNavClick(e, link)}>
                {children}
              </a>
            )
          ) : (
            // 当不存在link.path时的渲染（通常为带子菜单的父节点）
            <a
              key="link"
              onClick={link.children ? () => toggleExpand(link) : undefined}
            >
              {children}
            </a>
          );
        }}
        isActive={(link: any) => location.pathname === link.path}
      />
    </div>
  );
};

export default themeable(Aside);
