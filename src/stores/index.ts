import {
    types,
    getEnv
} from "mobx-state-tree";
// import User  from "./User";
const MainStore = types
    .model('MainStore', {
        theme: 'cxd',
        // user: types.optional(User, {}),
        asideFixed: true,
        asideFolded: false,
        offScreen: false,
        preview: false,
        isMobile: false,
        permsCode: types.array(types.string)
    })
    .views((self) => ({
        get fetcher() {
            return getEnv(self).fetcher
        },
        get notify() {
            return getEnv(self).notify
        },
        get alert() {
            return getEnv(self).alert
        },
        get copy() {
            return getEnv(self).copy
        },
        get hasPerms() {
            return getEnv(self).hasPerms
        }
    }))
    .actions((self) => {
        function toggleAsideFolded() {
            self.asideFolded = !self.asideFolded;
            localStorage.setItem('asideFolded', self.asideFolded ? '1' : '')
        }

        function toggleAsideFixed() {
            self.asideFixed = !self.asideFixed;
        }

        function toggleOffScreen() {
            self.offScreen = !self.offScreen;
        }

        function setPreview(value: boolean) {
            self.preview = value;
        }
      
        function setIsMobile(value: boolean) {
            self.isMobile = value;
        }

        function setPermsCode(perms: string[]) {
            self.permsCode = perms;
        }

        return {
            toggleAsideFolded,
            toggleAsideFixed,
            toggleOffScreen,
            setPreview,
            setIsMobile,
            setPermsCode,
            afterCreate: function() {
                self.asideFolded = !!localStorage.getItem('asideFolded');
            }
        };
    });
export {MainStore}

export type IMainStore = typeof MainStore.Type;