import React, { useEffect, useState } from 'react';

import AMISEditor from '@/components/Amis/AMISEditor';
import { getMenuSchema } from '@/services/quick-admin-api/menuschema';
import { useParams } from 'umi';

const SchemaEditor: React.FC = () => {
  const [schema, setSchema] = useState();
  // 获取参数
  const { id } = useParams<{ id: string }>();

  // 同步获取页面 schema
  useEffect(() => {
    getMenuSchema({ id: id }).then((result) => {
      const schema = result.data !== null ? JSON.parse(result.data.schemaJson) : {};
      setSchema(schema);
    });
  }, []);

  return <AMISEditor schema={schema} id={id}></AMISEditor>;
};

export default SchemaEditor;
