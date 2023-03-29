import AMISRenderer from '@/components/Amis/AMISRenderer';

const AdminSchema: React.FC = () => {

  const schema = {
      type: 'service',
      schemaApi: {
        "method": "get",
        // 根据路径查询页面配置
        "url": `/api/system/SysMenuSchema/getSchemaByPath?path=${location.pathname}`,
        "adaptor":function (payload: {
                      data: any; status: number;
                  }) {
                  return {
                      ...payload,
                      status: payload.status,
                      data: payload.data!==null?JSON.parse(payload.data.schemaJson):{}
                  };
        }
      }
    }

    return (
      <AMISRenderer schema={schema}></AMISRenderer>
    );
  };

export default AdminSchema;
