import { useLocation } from "react-router-dom";
import { Icon, Button, Select } from "amis-ui";
import { themeable } from "amis-core";
import AvatarDropdown from "./AvatarDropdown";
import type { IMainStore } from "@/store";

// Header 组件
const Header = (props: { classnames: any; store: IMainStore }) => {
  const { classnames: cx, store } = props;
  const { brandName, logo } = store;
  const location = useLocation();

  // 获取当前路径
  const currentPath = location.pathname;

  // 检查是否在projects路径下
  const isProjectsPage = currentPath.startsWith("/projects");

  return (
    <>
      {!isProjectsPage && (
        <div className={cx("Layout-brandBar")}>
          <div
            onClick={store.toggleOffScreen}
            className={cx("Layout-offScreenBtn")}
          >
            <i className="bui-icon iconfont icon-collapse"></i>
          </div>

          <div className={cx("Layout-brand")}>
            {logo && ~logo.indexOf("<svg") ? (
              <Html className={cx("AppLogo-html")} html={logo} />
            ) : logo ? (
              <img className={cx("AppLogo")} src={logo} />
            ) : (
              <span className="visible-folded ">
                {brandName?.substring(0, 1)}
              </span>
            )}
            <span className="hidden-folded m-l-sm font-semibold">{brandName}</span>
          </div>
        </div>
      )}

      <div className={cx("Layout-headerBar")}>
        {/* 在/projects路径下不显示折叠按钮 */}
        {!isProjectsPage && (
          <a
            onClick={store.toggleAsideFolded}
            type="button"
            className={cx("AppFoldBtn")}
          >
            <i
              className={`fa fa-${
                store.asideFolded ? "indent" : "dedent"
              } fa-fw`}
            ></i>
          </a>
        )}
        <div className="flex w-full justify-between items-center">
          <div>{isProjectsPage && <div>我的项目</div>}</div>
          <div className="flex items-center gap-4">
            <div>
              {/* <Button level="link">
                <Icon key="icon" icon="fa fa-cog" class="AsideNav-itemIcon" />
              </Button> */}
              <Select
                options={[
                  {
                    label: "云舍",
                    value: "cxd",
                  },
                  {
                    label: "仿antd",
                    value: "antd",
                  },
                  {
                    label: "ang",
                    value: "ang",
                  },
                  {
                    label: "暗黑",
                    value: "dark",
                  },
                ]}
                value={store.theme}
                clearable={false}
                onChange={(e: any) => {
                  store.setTheme(e.value);
                  window.location.reload(); // 强制刷新页面
                }}
              />
            </div>
            <AvatarDropdown src="https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default themeable(Header);
