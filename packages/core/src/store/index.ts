import { types, getEnv, applySnapshot, getSnapshot } from 'mobx-state-tree';
import { reaction } from 'mobx';

export const MainStore = types
  .model('MainStore', {
    theme: 'cxd',
    asideFixed: true,
    asideFolded: false,
    offScreen: false,
    preview: false,
    isMobile: false,
    pages: types.map(types.frozen()),
  })
  .views(self => ({
    get fetcher() {
      return getEnv(self).fetcher;
    },
    get notify() {
      return getEnv(self).notify;
    },
    get alert() {
      return getEnv(self).alert;
    },
    get copy() {
      return getEnv(self).copy;
    },
    // 获取当前页面的 schema
    getSchema(pageId: string) {
      return self.pages.get(pageId);
    },
  }))
  .actions(self => {
    function toggleAsideFolded() {
      self.asideFolded = !self.asideFolded;
    }

    function toggleAsideFixed() {
      self.asideFixed = !self.asideFixed;
    }

    function toggleOffScreen() {
      self.offScreen = !self.offScreen;
    }

    // 按 pageId 更新 schema
    function updateSchema(pageId: string, value: any) {
      self.pages.set(pageId, value);
    }

    function setPreview(value: boolean) {
      self.preview = value;
    }

    function setIsMobile(value: boolean) {
      self.isMobile = value;
    }

    function setTheme(theme: string) {
      self.theme = theme;
    }

    return {
      toggleAsideFolded,
      toggleAsideFixed,
      toggleOffScreen,
      updateSchema,
      setPreview,
      setIsMobile,
      setTheme,
      afterCreate() {
        // persist store
        if (typeof window !== 'undefined' && window.localStorage) {
          const storeData = window.localStorage.getItem('store');
          if (storeData) applySnapshot(self, JSON.parse(storeData));

          reaction(
            () => getSnapshot(self),
            json => {
              window.localStorage.setItem('store', JSON.stringify(json));
            }
          );
        }
      }
    };
  });

export type IMainStore = typeof MainStore.Type;
