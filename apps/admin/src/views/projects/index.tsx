import { themeable } from "amis-core";
import AmisRenderer from "@/components/AmisRenderer";
import schema from "./projects.json";

const Projects = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Projects);
