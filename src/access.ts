/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { permsCode?: [] } | undefined) {
  const { permsCode } = initialState ?? {};
  return {
    permsCode: permsCode,
  };
}
