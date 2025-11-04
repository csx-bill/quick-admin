import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import schema from "./config.json";

const Config = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Config);
