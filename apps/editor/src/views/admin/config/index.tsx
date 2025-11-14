import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./config.json";

const Config = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Config);
