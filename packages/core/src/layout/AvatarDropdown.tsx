import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Button } from "amis-ui";
import { themeable } from "amis-core";
import { fetcher } from "../api";
import UserService from "../store/userService";

/**
 * 头像下拉菜单组件
 * 功能：鼠标悬停头像显示用户信息和操作菜单
 */
const AvatarDropdown = (props: { classnames: any }) => {
  const { classnames: cx } = props;

  // 用户信息
  const userInfo = UserService.getUserInfo();

  // 控制下拉菜单显示状态
  const [isVisible, setIsVisible] = useState(false);
  // 组件根元素引用
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 头像区域引用
  const avatarRef = useRef<HTMLDivElement>(null);
  // 卡片区域引用
  const cardRef = useRef<HTMLDivElement>(null);
  // 路由导航hook
  const navigate = useNavigate();
  // 延迟隐藏的定时器
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 清除定时器函数
  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // 显示卡片
  const showCard = () => {
    clearHideTimer();
    setIsVisible(true);
  };

  // 延迟隐藏卡片
  const hideCard = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 500); // 确保鼠标有足够时间移动到卡片
  };

  // 处理鼠标进入头像区域
  const handleAvatarEnter = () => {
    showCard();
  };

  // 处理鼠标离开头像区域
  const handleAvatarLeave = (e: React.MouseEvent) => {
    // 检查鼠标是否移动到卡片区域
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (cardRef.current && cardRef.current.contains(relatedTarget)) {
      return; // 鼠标移动到卡片，不隐藏
    }
    hideCard();
  };

  // 处理鼠标进入卡片区域
  const handleCardEnter = () => {
    showCard();
  };

  // 处理鼠标离开卡片区域
  const handleCardLeave = (e: React.MouseEvent) => {
    // 检查鼠标是否移动到头像区域
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (avatarRef.current && avatarRef.current.contains(relatedTarget)) {
      return; // 鼠标移动到头像，不隐藏
    }
    hideCard();
  };

  // 处理点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearHideTimer();
    };
  }, []);

  /**
   * 退出登录
   */
  const logout = async () => {
    const res = await fetcher({
      url: `/api/auth/logout`,
      method: "post",
    });
    // 清除用户信息
    UserService.clearUserInfo();
    // 清除 accessToken
    UserService.clearAccessToken();

    navigate("/login", { replace: true });
    setIsVisible(false);
  };

  return (
    <div ref={dropdownRef}>
      {/* 头像容器 - 鼠标悬停触发显示下拉菜单 */}
      <div
        ref={avatarRef}
        onMouseEnter={handleAvatarEnter}
        onMouseLeave={handleAvatarLeave}
      >
        <Avatar src={userInfo?.avatar} />
      </div>

      {/* 使用Card组件作为下拉菜单卡片 */}
      {isVisible && (
        <div
          ref={cardRef}
          className="dropdown-card-wrapper"
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
        >
          <Card
            title={
              <div className="flex items-center space-x-4">
                <Avatar src={userInfo?.avatar} />
                <div className="flex-1 ">
                  <div className="text-lg font-semibold">
                    {userInfo?.username}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {userInfo?.username}
                  </div>
                </div>
              </div>
            }
          >
            <Button className={cx("Button--block")} onClick={() => logout()}>
              退出登录
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default themeable(AvatarDropdown);
