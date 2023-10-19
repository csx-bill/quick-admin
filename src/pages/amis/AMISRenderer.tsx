import React,{ useState, useEffect } from 'react';
import {getLocale } from 'umi';
import { useModel } from '@umijs/max';

import axios from 'axios';
import copy from 'copy-to-clipboard';
import { render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, toast } from 'amis-ui';
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { fetcher,theme } from '@/utils/amisEnvUtils';

const AMISRenderer: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const [schema, setSchema] = useState(null);

    useEffect(() => {
    // 使用递归方式来查找当前打开页面的菜单项
    function findCurrentMenu(menuData, targetPath) {
      for (const menuItem of menuData) {
        if (menuItem.path === targetPath) {
          return menuItem; // 找到匹配的菜单项
        }
        if (menuItem.children) {
          const foundItem = findCurrentMenu(menuItem.children, targetPath);
          if (foundItem) {
            return foundItem; // 在子菜单中找到匹配的菜单项
          }
        }
      }
      return null; // 未找到匹配的菜单项
    }

    const pathname = location.pathname;
    const menuData = initialState?.currentUser?.userMenuTree;
    const currentMenu = findCurrentMenu(menuData,pathname);
    setSchema(currentMenu?.schema !== null ? JSON.parse(currentMenu?.schema) : {});

    }, []);

    //let amisScoped;

    // 当前语言
    const curLanguage = getLocale();
  return (

      <div>
      <ToastComponent theme={theme} key="toast" position={'top-center'} locale={curLanguage} />
      <AlertComponent theme={theme} key="alert" locale={curLanguage} />

        {renderAmis(
          schema,
          {
            // props...
             locale: curLanguage, // 请参考「多语言」的文档
            // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
            context: {
                // 全局上下文数据, 非受控的数据，无论哪一层都能获取到，包括弹窗自定义数据映射后都能获取到。
                // 取值方式 ${permsCode}
                permsCode: initialState?.currentUser?.permsCode,
              }
          },
          {
            // 下面三个接口必须实现
            fetcher,
            isCancel: (value: any) => (axios as any).isCancel(value),
            copy: content => {
              copy(content);
              toast.success('内容已复制到粘贴板');
            },
            theme
          }
        )}

      </div>
  );
};

export default AMISRenderer;

