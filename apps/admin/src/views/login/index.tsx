import { themeable } from "amis-core";
import schema from "./login.json";
import { AmisRenderer,Footer } from "@quick-admin-core";

const Login = (props: { classnames: any }) => {
  return (
    <>
      <AmisRenderer schema={schema} />
      <Footer />
    </>
  );
};

export default themeable(Login);
