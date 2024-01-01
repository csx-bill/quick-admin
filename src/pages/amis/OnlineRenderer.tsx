import React,{ useState, useEffect } from 'react';
import {getLocale,history,useLocation } from 'umi';
import { useModel } from '@umijs/max';

import axios from 'axios';
import copy from 'copy-to-clipboard';
import { render as renderAmis } from 'amis';
import { ToastComponent, AlertComponent, toast } from 'amis-ui';
import 'amis/lib/themes/antd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { fetcher,theme } from '@/utils/amisEnvUtils';

import { getOnlineSchema } from '@/api/menu';

import './common.scss';

const OnlineRenderer: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const [schema, setSchema] = useState(null);

    const location = useLocation();


    useEffect(() => {
    // 接口获取
    async function findCurrentMenu(id) {
      const res = await getOnlineSchema({id: id})
      setSchema(res.data===null?{}:res.data);
    }

    const id = location.pathname.split('/online/formList/')[1]??location.pathname.split('/online/formlist/')[1];
    findCurrentMenu(id);
    }, []);

    //let amisScoped;

    // 当前语言
    const curLanguage = getLocale();
  return (

      <div className="runtime-keep-alive-layout">
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
            theme,
            // 默认是地址跳转
            jumpTo: (
              location: string /*目标地址*/,
              action: any /* action对象*/
            ) => {
              // 实现 amis 触发 多页签打开
              // 用来实现页面跳转, actionType:link、url 都会进来。
              if (action && action.actionType === 'url' && action.blank ===false) {
                history.push(location);
                return;
              } else if (action && action.blank) {
                window.open(location, '_blank');
                return;
              }else{
                history.push(location);
              }
            },

          }
        )}

      </div>
  );
};

export default OnlineRenderer;

