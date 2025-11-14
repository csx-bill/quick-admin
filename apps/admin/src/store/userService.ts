/**
 * 用户信息类型定义
 */
export interface UserInfo {
    id?: string;
    username?: string;
    avatar?: string;
    email?: string;
    roles?: string[];
    // 其他自定义用户信息字段
    [key: string]: any;
  }
  
  /**
   * 用户信息服务
   * 提供用户信息的获取、设置、清除和事件监听功能
   */
  const UserService = {
    /**
     * 获取当前用户信息
     * @returns {UserInfo} 用户信息对象
     */
    getUserInfo: (): UserInfo => {
      if (typeof window === 'undefined') return {};
      
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        return userInfoStr ? JSON.parse(userInfoStr) : {};
      } catch (e) {
        console.error('Error parsing userInfo from localStorage', e);
        return {};
      }
    },
  
    /**
     * 设置用户信息
     * @param {UserInfo} userInfo - 用户信息对象
     */
    setUserInfo: (userInfo: UserInfo) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } catch (e) {
        console.error('Error saving userInfo to localStorage', e);
      }
    },
  
    /**
     * 清除用户信息
     */
    clearUserInfo: () => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem('userInfo');
      } catch (e) {
        console.error('Error clearing userInfo from localStorage', e);
      }
    },
  
  
    /**
     * 检查用户是否已登录
     * @returns {boolean} 是否已登录
     */
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('accessToken');
    },
  
    /**
     * 获取访问令牌
     * @returns {string | null} 访问令牌
     */
    getAccessToken: (): string | null => {
      return localStorage.getItem('accessToken');
    },
  
    /**
     * 设置访问令牌
     * @param {string} token - 访问令牌
     */
    setAccessToken: (token: string) => {
      localStorage.setItem('accessToken', token);
    },
  
    /**
     * 清除访问令牌
     */
    clearAccessToken: () => {
      localStorage.removeItem('accessToken');
    },
  };
  
  export default UserService;