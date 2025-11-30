// 用于管理多标签页的项目ID隔离
class ProjectService {
  private storageKey = 'current_project_id';

  setCurrentProjectId(projectId: string) {
    // 使用 SessionStorage 确保每个标签页独立存储
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.storageKey, projectId);
    }
  }

  getCurrentProjectId(): string | null {
    // 从 SessionStorage 实时读取
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(this.storageKey);
    }
    return null;
  }

  clearCurrentProjectId() {
    // 清理 SessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.storageKey);
    }
  }

  // 获取存储键名（用于事件监听）
  getStorageKey(): string {
    return this.storageKey;
  }
}

export default new ProjectService();