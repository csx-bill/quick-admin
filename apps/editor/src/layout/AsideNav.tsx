/**
 * @file AsideNav
 * @description 左侧导航。
 * @author fex
 */

import React from "react";
import { TestIdBuilder, mapTree } from "amis-core";
import { themeable } from "amis-core";
import type { ClassNamesFn } from "amis-core";

export type LinkItem = LinkItemProps;
interface LinkItemProps {
  id?: number | string;
  label: string;
  hidden?: boolean;
  open?: boolean;
  active?: boolean;
  className?: string;
  children?: Array<LinkItem>;
  path?: string;
  icon?: string;
  component?: React.ElementType;
  testIdBuilder?: TestIdBuilder;
}

export interface Navigation {
  label: string;
  children?: Array<LinkItem>;
  prefix?: JSX.Element;
  affix?: JSX.Element;
  className?: string;
  [propName: string]: any;
}

export interface AsideNavProps {
  id?: string;
  className?: string;
  classPrefix: string;
  classnames: ClassNamesFn;
  renderLink: Function;
  isActive: Function;
  isOpen: (link: LinkItemProps) => boolean;
  navigations: Array<Navigation>;
  renderSubLinks: (
    link: LinkItemProps,
    renderLink: Function,
    depth: number,
    props: AsideNavProps
  ) => React.ReactNode;
  // 添加默认折叠状态属性
  defaultCollapsed?: boolean;
}

interface AsideNavState {
  navigations: Array<Navigation>;
  // 添加折叠状态管理
  collapsedStates: Record<number | string, boolean>;
  // 添加用户手动操作记录
  userToggled: Record<number | string, boolean>;
}

export class AsideNav extends React.Component<AsideNavProps, AsideNavState> {
  static defaultProps = {
    renderLink: (item: LinkItemProps) => (
      <a {...item.testIdBuilder?.getTestId()}>{item.label}</a>
    ),
    renderSubLinks: (
      link: LinkItemProps,
      renderLink: Function,
      depth: number,
      { classnames: cx }: AsideNavProps
    ) =>
      link.children && link.children.length ? (
        <ul className={cx("AsideNav-subList")}>
          {link.label ? (
            <li key="subHeader" className={cx("AsideNav-subHeader")}>
              {renderLink(
                {
                  ...link,
                  children: undefined,
                },
                "subHeader",
                {},
                depth
              )}
            </li>
          ) : null}
          {link.children.map((link, key) =>
            renderLink(link, key, {}, depth + 1)
          )}
        </ul>
      ) : link.label && depth === 1 ? (
        <div className={cx("AsideNav-tooltip")}>{link.label}</div>
      ) : null,
    isActive: (link: LinkItem) => link.open,
    isOpen: (item: LinkItemProps) =>
      item.children ? item.children.some((item) => item.open) : false,
    // 添加默认折叠状态
    defaultCollapsed: true,
  };

  constructor(props: AsideNavProps) {
    super(props);

    const navigations = mapTree(
      props.navigations,
      (item: Navigation) => {
        const isActive =
          typeof item.active === "undefined"
            ? (props.isActive as Function)(item)
            : item.active;

        return {
          ...item,
          active: isActive,
        };
      },
      1,
      true
    );

    // 初始化折叠状态
    const collapsedStates: Record<number | string, boolean> = {};
    const userToggled: Record<number | string, boolean> = {};

    // 设置折叠状态
    mapTree(navigations, (item: any) => {
      if (item.id) {
        // 默认折叠
        collapsedStates[item.id] = props.defaultCollapsed ?? true;
      }
      return item;
    });

    // 关键修复：展开激活项及其所有父目录
    const expandActivePaths = (items: any[]) => {
      // 为所有节点建立父引用
      const parentMap: Record<string, any> = {};
      const allNodes: any[] = [];

      mapTree(
        items,
        (item: any, index: number, level: number, paths: any[]) => {
          allNodes.push(item);
          if (item.id) {
            // 记录父节点
            if (paths.length > 0) {
              parentMap[item.id] = paths[paths.length - 1];
            }
          }
          return item;
        }
      );

      // 找到所有激活项
      const activeItems = allNodes.filter((item) => item.active);

      // 展开每个激活项及其所有父目录
      activeItems.forEach((item) => {
        // 展开激活项本身
        if (item.id) {
          collapsedStates[item.id] = false;
        }

        // 向上遍历展开所有父目录
        let parentId = item.id ? parentMap[item.id]?.id : null;
        while (parentId) {
          collapsedStates[parentId] = false;
          parentId = parentMap[parentId]?.id;
        }
      });
    };

    // 执行展开激活路径
    expandActivePaths(navigations);

    this.state = {
      navigations,
      collapsedStates,
      userToggled,
    };

    this.renderLink = this.renderLink.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidUpdate(prevProps: AsideNavProps) {
    const props = this.props;

    if (
      prevProps.navigations !== props.navigations ||
      prevProps.isActive !== props.isActive ||
      prevProps.defaultCollapsed !== props.defaultCollapsed
    ) {
      const navigations = mapTree(
        props.navigations,
        (item: Navigation) => {
          const isActive =
            typeof item.active === "undefined"
              ? (props.isActive as Function)(item)
              : item.active;

          return {
            ...item,
            active: isActive,
          };
        },
        1,
        true
      );

      // 更新折叠状态
      const collapsedStates = { ...this.state.collapsedStates };
      const userToggled = { ...this.state.userToggled };

      // 设置折叠状态
      mapTree(navigations, (item: any) => {
        if (item.id) {
          // 如果之前没有状态，则使用默认折叠状态
          if (collapsedStates[item.id] === undefined) {
            collapsedStates[item.id] = props.defaultCollapsed ?? true;
          }
        }
        return item;
      });

      // 关键修复：展开激活项及其所有父目录
      const expandActivePaths = (items: any[]) => {
        // 为所有节点建立父引用
        const parentMap: Record<string, any> = {};
        const allNodes: any[] = [];

        mapTree(
          items,
          (item: any, index: number, level: number, paths: any[]) => {
            allNodes.push(item);
            if (item.id) {
              // 记录父节点
              if (paths.length > 0) {
                parentMap[item.id] = paths[paths.length - 1];
              }
            }
            return item;
          }
        );

        // 找到所有激活项
        const activeItems = allNodes.filter((item) => item.active);

        // 展开每个激活项及其所有父目录
        activeItems.forEach((item) => {
          // 如果用户没有手动操作过，才自动展开
          if (item.id && !userToggled[item.id]) {
            collapsedStates[item.id] = false;
          }

          // 向上遍历展开所有父目录
          let parentId = item.id ? parentMap[item.id]?.id : null;
          while (parentId) {
            // 如果用户没有手动操作过父目录，才自动展开
            if (!userToggled[parentId]) {
              collapsedStates[parentId] = false;
            }
            parentId = parentMap[parentId]?.id;
          }
        });
      };

      // 执行展开激活路径
      expandActivePaths(navigations);

      this.setState({
        navigations,
        collapsedStates,
        userToggled,
      });
    }
  }

  toggleExpand(link: LinkItemProps, e?: React.MouseEvent<HTMLElement>) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.setState((prevState) => {
      const newCollapsed = !prevState.collapsedStates[link.id!];

      return {
        collapsedStates: {
          ...prevState.collapsedStates,
          [link.id!]: newCollapsed,
        },
        userToggled: {
          ...prevState.userToggled,
          [link.id!]: true, // 标记用户已手动操作
        },
      };
    });
  }

  renderLink(
    link: LinkItemProps,
    key: any,
    props: Partial<AsideNavProps> = {},
    depth = 1
  ): React.ReactNode {
    const {
      renderLink,
      isActive,
      renderSubLinks,
      classnames: cx,
      ...others
    } = this.props;

    // 获取当前项的折叠状态
    const isCollapsed =
      this.state.collapsedStates[link.id!] ?? this.props.defaultCollapsed;

    const dom = (renderLink as Function)({
      link,
      active: link.active,
      open: !isCollapsed,
      toggleExpand: this.toggleExpand,
      depth,
      classnames: cx,
      subHeader: key === "subHeader",
      ...others,
    });

    if (!dom) {
      return;
    } else if (key === "subHeader") {
      return React.cloneElement(dom, {
        key,
      });
    }

    return (
      <li
        {...props}
        key={key}
        className={cx(`AsideNav-item`, link.className, {
          [`is-open`]: !isCollapsed,
          [`is-active`]: link.active,
        })}
      >
        {dom}
        {!isCollapsed &&
          renderSubLinks(link, this.renderLink, depth, this.props)}
      </li>
    );
  }

  render() {
    const navigations = this.state.navigations;
    let links: Array<React.ReactNode> = [];
    const { className, classnames: cx } = this.props;

    navigations.forEach((navigation, index) => {
      if (!Array.isArray(navigation.children)) {
        return;
      }

      if (navigation.prefix) {
        const prefix: JSX.Element =
          typeof navigation.prefix === "function"
            ? (navigation.prefix as any)(this.props)
            : navigation.prefix;
        links.push(
          React.cloneElement(prefix, {
            ...prefix.props,
            key: `${index}-prefix`,
          })
        );
      }

      navigation.label &&
        links.push(
          <li
            key={`${index}-label`}
            className={cx(`AsideNav-label`, navigation.className)}
          >
            <span>{navigation.label}</span>
          </li>
        );

      navigation.children.forEach((item, key) => {
        const link = this.renderLink(item, `${index}-${key}`);
        link && links.push(link);
      });

      if (navigation.affix) {
        const affix: JSX.Element =
          typeof navigation.affix === "function"
            ? (navigation.affix as any)(this.props)
            : navigation.affix;
        links.push(
          React.cloneElement(affix, {
            ...affix.props,
            key: `${index}-affix`,
          })
        );
      }
    });

    return (
      <nav className={cx(`AsideNav`, className)}>
        <ul className={cx(`AsideNav-list`)}>{links}</ul>
      </nav>
    );
  }
}

export default themeable(AsideNav);
