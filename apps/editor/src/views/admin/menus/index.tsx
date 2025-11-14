import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./menus.json";

const Menus = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Menus);
