import React, { useState, useEffect } from 'react';

import AMISEditor from '@/components/Amis/AMISEditor';
import { getMenuSchema } from '@/services/quick-admin-api/menuschema';
import { useParams } from 'umi';


const SchemaEditor: React.FC = () => {
  const [schema, setSchema] = useState();
  // 获取参数
  const { menuId } = useParams<{ menuId: string }>();


  // 同步获取页面 schema
  useEffect(() => {
    getMenuSchema({"menuId":menuId}).then((result)=>{
      const schema = result.data!==null?JSON.parse(result.data.schemaJson):{}
      setSchema(schema)
    });
  }, []);

    return (
      <AMISEditor schema={schema} menuId={menuId}></AMISEditor>
    );
  };

export default SchemaEditor;
