import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import { fetcher } from "@/api";

const Admin = (props: { classnames: any }) => {
  const [schema, setSchema] = useState<any>({});
  const params = useParams();
  const { projectId, pageId } = params;

  useEffect(() => {
    const fetchSchema = async () => {
      const res = await fetcher({
        url: `/api/pages/${pageId}`,
        method: "get",
      });
      setSchema(JSON.parse(res?.data?.data?.schema || {}));
    };

    fetchSchema();
  }, []);

  return <AmisRenderer schema={schema} />;
};

export default themeable(Admin);
