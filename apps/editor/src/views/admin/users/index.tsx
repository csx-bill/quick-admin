import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./users.json";

const Users = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Users);
