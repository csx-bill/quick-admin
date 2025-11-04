import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import schema from "./menus.json";

const Menus = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Menus);
