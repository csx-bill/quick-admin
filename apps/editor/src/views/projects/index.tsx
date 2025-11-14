import { themeable } from "amis-core";
import { AmisRenderer } from "@quick-admin-core";
import schema from "./projects.json";

const Projects = (props: { classnames: any }) => {
  return <AmisRenderer schema={schema} />;
};

export default themeable(Projects);
