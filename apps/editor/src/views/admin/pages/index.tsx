import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import schema from "./pages.json";

const Pages = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Pages);
