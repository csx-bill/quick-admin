import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./roles.json";

const Roles = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Roles);
