import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./pages.json";

const Pages = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Pages);
