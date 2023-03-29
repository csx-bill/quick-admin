import { SelectLang as UmiSelectLang } from '@umijs/max';
import React from 'react';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};
