import React, { useEffect } from "react";
import { Editor } from "amis-editor";
import "amis-editor-core/lib/style.css";
import { setDefaultTheme } from "amis-core";

interface AmisEditorProps {
  theme: string;
  schema: any;
  preview?: boolean;
  isMobile?: boolean;
  onChange?: (value: any) => void;
  onSave?: () => void;
  setPreview?: (preview: boolean) => void;
  amisEnv?: {
    fetcher: any;
    notify: any;
    alert: any;
    copy: any;
    confirm?: any;
  };
}

const AmisEditor = (props: AmisEditorProps) => {
  const {
    theme,
    schema,
    preview = false,
    isMobile = false,
    onChange,
    onSave,
    setPreview,
    amisEnv,
  } = props;

  // 动态加载CSS
  useEffect(() => {
    setDefaultTheme(theme);
  }, [theme]);

  return (
    <Editor
      theme={theme}
      preview={preview}
      isMobile={isMobile}
      value={schema}
      onChange={onChange}
      onPreview={() => setPreview?.(true)}
      onSave={onSave}
      showCustomRenderersPanel={true}
      amisEnv={amisEnv}
    />
  );
};

export default AmisEditor;
